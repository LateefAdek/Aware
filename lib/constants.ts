import type {
  MoodDefinition,
  CrisisResource,
  StressorTag,
  Resource,
} from "@/types";

// ─── Color Palette ────────────────────────────────────────────────────────────
export const COLORS = {
  cream: "#fbf8f3",
  sage: "#a0b89f",
  sageLight: "#c8d9c7",
  sageDark: "#7a9e79",
  slate: "#6e8b9d",
  slateLight: "#a8c0ce",
  slateDark: "#4e6a7a",
  softGrey: "#d3d3d3",
  textPrimary: "#2d3a3a",
  textSecondary: "#5a6e6e",
  textMuted: "#8fa0a0",
  mutedWarning: "#805e5a",
  emergency: "#d93025",
  surface: "#f0ece5",
  border: "#e0dbd3",
} as const;

// ─── Mood Definitions ─────────────────────────────────────────────────────────
export const MOODS: MoodDefinition[] = [
  {
    code: 1,
    label: "Radiant",
    emoji: "✨",
    color: "#5a9e57",
    bgColor: "#eef5ed",
    borderColor: "#a0b89f",
    description: "Feeling vibrant and full of energy",
  },
  {
    code: 2,
    label: "Content",
    emoji: "🌿",
    color: "#7a9e79",
    bgColor: "#f0f6ef",
    borderColor: "#c0d4bf",
    description: "Calm, at ease, and balanced",
  },
  {
    code: 3,
    label: "Neutral",
    emoji: "🌊",
    color: "#6e8b9d",
    bgColor: "#eef3f6",
    borderColor: "#a8c0ce",
    description: "Neither up nor down — just present",
  },
  {
    code: 4,
    label: "Drained",
    emoji: "🍂",
    color: "#9e7a6e",
    bgColor: "#f6f0ee",
    borderColor: "#c4a8a0",
    description: "Feeling low on energy or motivation",
  },
  {
    code: 5,
    label: "Struggling",
    emoji: "🌧️",
    color: "#805e5a",
    bgColor: "#f4edec",
    borderColor: "#b09896",
    description: "Going through a difficult moment",
  },
];

export const getMoodByCode = (code: number): MoodDefinition =>
  MOODS.find((m) => m.code === code) ?? MOODS[2];

// ─── Stressor Tags ─────────────────────────────────────────────────────────────
export const STRESSOR_TAGS: StressorTag[] = [
  "Exams",
  "Deadline",
  "Sleep",
  "Social",
  "Finances",
  "Health",
  "Relationships",
  "Classes",
];

// ─── Crisis Resources (Static Fallback) ───────────────────────────────────────
export const NATIONAL_CRISIS_RESOURCES: CrisisResource[] = [
  {
    directory_id: 1,
    contact_name: "988 Suicide & Crisis Lifeline",
    contact_value: "988",
    contact_priority: 1,
    contact_type: "phone",
  },
  {
    directory_id: 2,
    contact_name: "Crisis Text Line",
    contact_value: "741741",
    contact_priority: 2,
    contact_type: "text",
  },
  {
    directory_id: 3,
    contact_name: "SAMHSA National Helpline",
    contact_value: "1-800-662-4357",
    contact_priority: 3,
    contact_type: "phone",
  },
];

// ─── Daily Spark Resources (Seed Data / Fallback) ─────────────────────────────
export const SEED_RESOURCES: Resource[] = [
  {
    resource_id: 1,
    resource_type: "AFFIRMATION",
    title: "You are enough",
    content_body:
      "Right now, in this moment, you are exactly where you need to be. Your worth is not measured by your productivity or your grades. Take a breath and remind yourself: I am enough.",
    target_mood_codes: null,
    is_active: true,
  },
  {
    resource_id: 2,
    resource_type: "BREATHING_EXERCISE",
    title: "4-7-8 Breathing",
    content_body:
      "Inhale quietly through your nose for 4 seconds. Hold your breath for 7 seconds. Exhale completely through your mouth for 8 seconds. Repeat 3 times.",
    target_mood_codes: [4, 5],
    is_active: true,
    duration_seconds: 60,
  },
  {
    resource_id: 3,
    resource_type: "GUIDED_REFLECTION",
    title: "Three Good Things",
    content_body:
      "Take 2 minutes to write down three things that went well today, no matter how small. Notice how your attention shifts toward what's working. Even on hard days, something is always there.",
    target_mood_codes: [3, 4],
    is_active: true,
  },
  {
    resource_id: 4,
    resource_type: "AFFIRMATION",
    title: "Rest is productive",
    content_body:
      "Choosing to rest is not laziness — it is wisdom. Your brain consolidates learning, processes emotions, and restores focus during rest. Giving yourself a break is one of the most productive things you can do.",
    target_mood_codes: [4, 5],
    is_active: true,
  },
  {
    resource_id: 5,
    resource_type: "BURNOUT_RECOVERY",
    title: "Burnout First Aid",
    content_body:
      "When everything feels like too much, start with just one small thing: drink a glass of water, step outside for 60 seconds, or close your eyes and breathe slowly five times. Burnout doesn't lift all at once — it lifts one small step at a time.",
    target_mood_codes: [4, 5],
    is_active: true,
  },
  {
    resource_id: 6,
    resource_type: "BREATHING_EXERCISE",
    title: "Box Breathing",
    content_body:
      "Inhale for 4 counts. Hold for 4 counts. Exhale for 4 counts. Hold for 4 counts. Repeat this cycle 4 times. Used by athletes and first responders to calm the nervous system quickly.",
    target_mood_codes: [3, 4, 5],
    is_active: true,
    duration_seconds: 64,
  },
  {
    resource_id: 7,
    resource_type: "AFFIRMATION",
    title: "Progress, not perfection",
    content_body:
      "Academic life can make perfection feel like the only standard worth chasing. But progress — even slow, even messy — is the real measure of growth. You don't have to have it all figured out today.",
    target_mood_codes: null,
    is_active: true,
  },
];

// ─── Time Block Logic ─────────────────────────────────────────────────────────
export const TIME_BLOCKS = [
  { label: "Early Morning", start: 5, end: 8 },
  { label: "Morning", start: 8, end: 12 },
  { label: "Afternoon", start: 12, end: 17 },
  { label: "Evening", start: 17, end: 21 },
  { label: "Late Night Study", start: 21, end: 24 },
  { label: "Night", start: 0, end: 5 },
];

// ─── App Config ────────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  appName: "Aware",
  tagline: "Support in Seconds",
  burnoutThreshold: 3, // consecutive days of Drained/Struggling to trigger override
  kAnonymityThreshold: 50, // minimum group size for admin reporting
  moodLogStreakGoal: 7, // 7-day streak goal
} as const;

// ─── Consent Text ─────────────────────────────────────────────────────────────
export const CONSENT_TEXT = `By using Aware, you agree to our Privacy Policy and Terms of Service. 

Your mood data is stored securely and is never shared with academic institutions, used for grade evaluation, or sold to advertisers. You have the right to export or permanently delete your data at any time.

Aware complies with FERPA, HIPAA, and GDPR regulations to protect your privacy.`;
