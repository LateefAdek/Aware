-- AWARE: Anonymized Mood Aggregator Function
-- Runs nightly via pg_cron or Supabase scheduled job
-- Implements K-Anonymity: only stores aggregate if total_logs > 50

CREATE OR REPLACE FUNCTION public.calculate_weekly_mood_aggregates(
    period_start DATE DEFAULT (DATE_TRUNC('week', NOW() - INTERVAL '1 week'))::DATE,
    period_end   DATE DEFAULT (DATE_TRUNC('week', NOW()) - INTERVAL '1 day')::DATE
)
RETURNS void AS $$
DECLARE
    k_anonymity_threshold CONSTANT INT := 50;
BEGIN
    -- For each university that has mood logs in the period
    INSERT INTO public.anonymized_mood_aggregates (
        reporting_period_start,
        reporting_period_end,
        university_id,
        mood_count_radiant,
        mood_count_content,
        mood_count_neutral,
        mood_count_drained,
        mood_count_struggling,
        total_logs_in_period,
        peak_usage_hour
    )
    SELECT
        period_start,
        period_end,
        p.university_id,
        COUNT(*) FILTER (WHERE ml.mood_icon_code = 1) AS mood_count_radiant,
        COUNT(*) FILTER (WHERE ml.mood_icon_code = 2) AS mood_count_content,
        COUNT(*) FILTER (WHERE ml.mood_icon_code = 3) AS mood_count_neutral,
        COUNT(*) FILTER (WHERE ml.mood_icon_code = 4) AS mood_count_drained,
        COUNT(*) FILTER (WHERE ml.mood_icon_code = 5) AS mood_count_struggling,
        COUNT(*) AS total_logs_in_period,
        -- Peak usage hour (mode of log hours)
        MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM ml.log_timestamp)) AS peak_usage_hour
    FROM public.mood_logs ml
    JOIN public.profiles p ON p.user_id = ml.user_id
    WHERE ml.log_timestamp >= period_start
      AND ml.log_timestamp < period_end + INTERVAL '1 day'
    GROUP BY p.university_id
    HAVING COUNT(*) >= k_anonymity_threshold  -- K-Anonymity enforcement
    ON CONFLICT (reporting_period_start, university_id) DO UPDATE SET
        mood_count_radiant    = EXCLUDED.mood_count_radiant,
        mood_count_content    = EXCLUDED.mood_count_content,
        mood_count_neutral    = EXCLUDED.mood_count_neutral,
        mood_count_drained    = EXCLUDED.mood_count_drained,
        mood_count_struggling = EXCLUDED.mood_count_struggling,
        total_logs_in_period  = EXCLUDED.total_logs_in_period,
        peak_usage_hour       = EXCLUDED.peak_usage_hour;

    -- Log the aggregation run in audit log
    INSERT INTO public.data_access_audit_log (target_table, query_context, success_status)
    VALUES ('mood_logs', 'Weekly anonymized aggregate calculation via cron', TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin view: Aggregated Mood Index (safe for admin dashboard)
-- Only returns rows meeting K-Anonymity threshold
CREATE OR REPLACE VIEW public.v_admin_pulse AS
    SELECT
        aggregate_id,
        reporting_period_start,
        reporting_period_end,
        u.university_name,
        mood_count_radiant,
        mood_count_content,
        mood_count_neutral,
        mood_count_drained,
        mood_count_struggling,
        total_logs_in_period,
        peak_usage_hour,
        ROUND(
            (mood_count_radiant + mood_count_content)::NUMERIC / 
            NULLIF(total_logs_in_period, 0) * 100, 1
        ) AS positive_pct,
        ROUND(
            (mood_count_drained + mood_count_struggling)::NUMERIC / 
            NULLIF(total_logs_in_period, 0) * 100, 1
        ) AS struggling_pct
    FROM public.anonymized_mood_aggregates ama
    LEFT JOIN public.universities u ON u.university_id = ama.university_id
    WHERE total_logs_in_period > 50  -- K-Anonymity guard
    ORDER BY reporting_period_start DESC, total_logs_in_period DESC;
