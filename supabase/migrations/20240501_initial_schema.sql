-- ============================================================
-- AWARE: INITIAL DATABASE SCHEMA
-- Version: 1.0 | FERPA / GDPR / HIPAA Compliant
-- ============================================================
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. UNIVERSITIES (Institutional metadata)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.universities (
    university_id   SERIAL PRIMARY KEY,
    university_name TEXT NOT NULL,
    campus_crisis_phone TEXT,
    campus_health_url   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. USERS / PROFILES (extends Supabase Auth)
-- ============================================================
-- NOTE: Supabase Auth manages auth.users. This table stores
-- additional profile data and is linked via user_id (UUID).
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Email stored via Supabase Auth, not here (PII minimization)
    university_id   INT REFERENCES public.universities(university_id),
    display_name    TEXT,
    consent_given   BOOLEAN NOT NULL DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, consent_given, consent_timestamp)
    VALUES (
        NEW.id,
        COALESCE((NEW.raw_user_meta_data->>'consent_given')::boolean, FALSE),
        CASE 
            WHEN (NEW.raw_user_meta_data->>'consent_given')::boolean THEN NOW()
            ELSE NULL
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. MOOD LOGS (Core high-velocity data)
-- ============================================================
-- COMPLIANCE: user_id links to personal history only.
-- Administrative reporting must use anonymized_mood_aggregates view.
CREATE TABLE IF NOT EXISTS public.mood_logs (
    log_id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    mood_icon_code      SMALLINT NOT NULL CHECK (mood_icon_code BETWEEN 1 AND 5),
    -- 1=Radiant, 2=Content, 3=Neutral, 4=Drained, 5=Struggling
    log_timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_block_context  TEXT NOT NULL,
    -- e.g. 'Morning', 'Afternoon', 'Evening', 'Late Night Study', 'Night'
    stressor_tags       TEXT[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast personal history queries
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_time 
    ON public.mood_logs(user_id, log_timestamp DESC);

-- Index for anonymized aggregation queries
CREATE INDEX IF NOT EXISTS idx_mood_logs_timestamp 
    ON public.mood_logs(log_timestamp DESC);

-- ============================================================
-- 4. RESOURCES (Daily Spark content library)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resources (
    resource_id         SERIAL PRIMARY KEY,
    resource_type       TEXT NOT NULL CHECK (resource_type IN (
                            'AFFIRMATION', 'BREATHING_EXERCISE', 
                            'GUIDED_REFLECTION', 'BURNOUT_RECOVERY'
                        )),
    title               TEXT NOT NULL,
    content_body        TEXT NOT NULL,
    target_mood_codes   SMALLINT[],  -- null = suitable for all moods
    duration_seconds    INT,          -- for timed exercises
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. DAILY RESOURCE HISTORY (Tracks delivery + engagement)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_resource_history (
    history_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    resource_id     INT NOT NULL REFERENCES public.resources(resource_id),
    delivery_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    engagement_type TEXT NOT NULL DEFAULT 'VIEWED'
                    CHECK (engagement_type IN ('VIEWED', 'SAVED_TO_FAVORITES', 'EXERCISE_COMPLETED', 'TRIGGERED_SOS_FOLLOWUP')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, delivery_date)  -- one resource per user per day
);

-- ============================================================
-- 6. USER FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_favorites (
    favorite_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    resource_id INT NOT NULL REFERENCES public.resources(resource_id),
    saved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- ============================================================
-- 7. PERSONAL EMERGENCY CONTACTS (User-configured SOS contacts)
-- ============================================================
-- COMPLIANCE: Stored encrypted at application layer before insert.
CREATE TABLE IF NOT EXISTS public.personal_emergency_contacts (
    contact_pk      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    contact_name    TEXT NOT NULL,
    contact_phone   TEXT NOT NULL, -- Pre-formatted for click-to-call
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id) -- one personal contact per user
);

-- ============================================================
-- 8. CRISIS DIRECTORY (Tiered institutional crisis resources)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crisis_directory (
    directory_id        SERIAL PRIMARY KEY,
    university_id       INT REFERENCES public.universities(university_id),
    -- NULL university_id = national resource (applies to all)
    contact_name        TEXT NOT NULL,
    contact_value       TEXT NOT NULL,  -- phone number or URL
    contact_type        TEXT NOT NULL DEFAULT 'phone' 
                        CHECK (contact_type IN ('phone', 'text', 'url')),
    contact_priority    INT NOT NULL,   -- lower = higher priority in modal
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- National fallback resources (always available)
INSERT INTO public.crisis_directory (contact_name, contact_value, contact_type, contact_priority) VALUES
    ('988 Suicide & Crisis Lifeline', '988', 'phone', 1),
    ('Crisis Text Line', '741741', 'text', 2),
    ('SAMHSA National Helpline', '1-800-662-4357', 'phone', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. CRISIS ACTIVATIONS (Audit-only, anonymized)
-- ============================================================
-- COMPLIANCE: Records SOS access for Temporal Peak Usage analysis.
-- No call intent is logged. Strictly anonymized.
CREATE TABLE IF NOT EXISTS public.crisis_activations (
    activation_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id   INT REFERENCES public.universities(university_id),
    access_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_block_context TEXT
    -- NOTE: user_id intentionally excluded. Only university-level aggregate.
);

-- ============================================================
-- 10. ANONYMIZED MOOD AGGREGATES (Admin reporting — K-Anonymity)
-- ============================================================
-- COMPLIANCE: Populated by scheduled nightly job. Never contains PII.
-- Only shown when total_logs_in_period > 50 (K-Anonymity threshold).
CREATE TABLE IF NOT EXISTS public.anonymized_mood_aggregates (
    aggregate_id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporting_period_start  DATE NOT NULL,
    reporting_period_end    DATE NOT NULL,
    university_id           INT REFERENCES public.universities(university_id),
    mood_count_radiant      BIGINT NOT NULL DEFAULT 0,
    mood_count_content      BIGINT NOT NULL DEFAULT 0,
    mood_count_neutral      BIGINT NOT NULL DEFAULT 0,
    mood_count_drained      BIGINT NOT NULL DEFAULT 0,
    mood_count_struggling   BIGINT NOT NULL DEFAULT 0,
    total_logs_in_period    BIGINT NOT NULL,
    peak_usage_hour         SMALLINT, -- 0-23
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(reporting_period_start, university_id)
);

-- ============================================================
-- 11. RESOURCE ENGAGEMENT SUMMARY (Admin reporting)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resource_engagement_summary (
    summary_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id       INT REFERENCES public.universities(university_id),
    resource_type       TEXT NOT NULL,
    engagement_count    BIGINT NOT NULL DEFAULT 0,
    summary_period      DATE NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. DATA ACCESS AUDIT LOG (HIPAA/FERPA Technical Safeguard)
-- ============================================================
-- COMPLIANCE: Immutable append-only log of all data access.
CREATE TABLE IF NOT EXISTS public.data_access_audit_log (
    audit_id            BIGSERIAL PRIMARY KEY,
    accessed_by_user_id UUID, -- NULL for automated system jobs
    target_table        TEXT NOT NULL,
    query_context       TEXT NOT NULL,
    access_timestamp    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    success_status      BOOLEAN NOT NULL DEFAULT TRUE
);

-- Prevent updates/deletes on audit log (immutability)
CREATE OR REPLACE RULE audit_log_no_update AS ON UPDATE TO public.data_access_audit_log DO INSTEAD NOTHING;
CREATE OR REPLACE RULE audit_log_no_delete AS ON DELETE TO public.data_access_audit_log DO INSTEAD NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_resource_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymized_mood_aggregates ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only read/update their own profile
CREATE POLICY profiles_self_access ON public.profiles
    FOR ALL USING (auth.uid() = user_id);

-- MOOD LOGS: Users can only access their own logs
CREATE POLICY mood_logs_self_access ON public.mood_logs
    FOR ALL USING (auth.uid() = user_id);

-- DAILY RESOURCE HISTORY: Self-only
CREATE POLICY daily_resource_history_self ON public.daily_resource_history
    FOR ALL USING (auth.uid() = user_id);

-- USER FAVORITES: Self-only
CREATE POLICY user_favorites_self ON public.user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- PERSONAL EMERGENCY CONTACTS: Self-only
CREATE POLICY emergency_contacts_self ON public.personal_emergency_contacts
    FOR ALL USING (auth.uid() = user_id);

-- RESOURCES: All authenticated users can read active resources
CREATE POLICY resources_read_all ON public.resources
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- CRISIS DIRECTORY: All authenticated users can read active entries
CREATE POLICY crisis_directory_read_all ON public.crisis_directory
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- ANONYMIZED AGGREGATES: Admin-only access (use service_role in API routes)
CREATE POLICY anonymized_aggregates_admin_only ON public.anonymized_mood_aggregates
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'admin'
        AND total_logs_in_period > 50  -- K-Anonymity threshold enforcement
    );

-- ============================================================
-- SEED DATA: Daily Spark Resources
-- ============================================================
INSERT INTO public.resources (resource_type, title, content_body, target_mood_codes) VALUES
    ('AFFIRMATION', 'You are enough', 
     'Right now, in this moment, you are exactly where you need to be. Your worth is not measured by your productivity or your grades. Take a breath and remind yourself: I am enough.',
     NULL),
    ('BREATHING_EXERCISE', '4-7-8 Breathing', 
     'Inhale quietly through your nose for 4 seconds. Hold your breath for 7 seconds. Exhale completely through your mouth for 8 seconds. Repeat 3 times.',
     ARRAY[4,5]::SMALLINT[]),
    ('GUIDED_REFLECTION', 'Three Good Things', 
     'Take 2 minutes to write down three things that went well today, no matter how small. Notice how your attention shifts toward what''s working.',
     ARRAY[3,4]::SMALLINT[]),
    ('AFFIRMATION', 'Rest is productive', 
     'Choosing to rest is not laziness — it is wisdom. Your brain consolidates learning, processes emotions, and restores focus during rest.',
     ARRAY[4,5]::SMALLINT[]),
    ('BURNOUT_RECOVERY', 'Burnout First Aid', 
     'When everything feels like too much, start with just one small thing: drink a glass of water, step outside for 60 seconds, or close your eyes and breathe slowly five times.',
     ARRAY[4,5]::SMALLINT[]),
    ('BREATHING_EXERCISE', 'Box Breathing', 
     'Inhale for 4 counts. Hold for 4 counts. Exhale for 4 counts. Hold for 4 counts. Repeat this cycle 4 times. Used by athletes and first responders to calm the nervous system quickly.',
     ARRAY[3,4,5]::SMALLINT[]),
    ('AFFIRMATION', 'Progress, not perfection', 
     'Academic life can make perfection feel like the only standard worth chasing. But progress — even slow, even messy — is the real measure of growth.',
     NULL)
ON CONFLICT DO NOTHING;
