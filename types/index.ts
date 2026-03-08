// Mood Types
export type MoodCode = 1 | 2 | 3 | 4 | 5;

export interface MoodDefinition {
  code: MoodCode;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface MoodLog {
  log_id: string;
  user_id: string;
  mood_icon_code: MoodCode;
  log_timestamp: string;
  time_block_context: string;
  stressor_tags: string[] | null;
  created_at: string;
}

export type StressorTag =
  | "Exams"
  | "Deadline"
  | "Social"
  | "Sleep"
  | "Finances"
  | "Health"
  | "Relationships"
  | "Classes";

// Resource Types
export type ResourceType =
  | "AFFIRMATION"
  | "BREATHING_EXERCISE"
  | "GUIDED_REFLECTION"
  | "BURNOUT_RECOVERY";

export interface Resource {
  resource_id: number;
  resource_type: ResourceType;
  title: string;
  content_body: string;
  target_mood_codes: MoodCode[] | null;
  is_active: boolean;
  duration_seconds?: number;
}

export interface DailySparkResource extends Resource {
  is_burnout_override?: boolean;
}

// User / Profile Types
export interface UserProfile {
  user_id: string;
  email: string;
  display_name?: string;
  university_id?: number;
  personal_emergency_contact?: EmergencyContact;
  consent_given: boolean;
  created_at: string;
  is_active: boolean;
}

// Crisis / SOS Types
export interface EmergencyContact {
  contact_name: string;
  contact_phone: string;
}

export interface CrisisResource {
  directory_id: number;
  contact_name: string;
  contact_value: string;
  contact_priority: number;
  contact_type: "phone" | "text" | "url";
}

// Time block categories
export type TimeBlock =
  | "Early Morning"
  | "Morning"
  | "Afternoon"
  | "Evening"
  | "Late Night Study"
  | "Night";

// Favorites
export interface FavoriteResource {
  favorite_id: string;
  resource_id: number;
  saved_at: string;
  resource: Resource;
}

// Admin / Analytics
export interface AnonymizedMoodAggregate {
  aggregate_id: string;
  reporting_period_start: string;
  university_id: number;
  mood_count_radiant: number;
  mood_count_content: number;
  mood_count_neutral: number;
  mood_count_drained: number;
  mood_count_struggling: number;
  total_logs_in_period: number;
  peak_usage_hour: number | null;
}

// Navigation
export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

// Settings
export interface UserSettings {
  high_contrast_mode: boolean;
  notifications_enabled: boolean;
  daily_reminder_time?: string;
  mfa_enabled: boolean;
}
