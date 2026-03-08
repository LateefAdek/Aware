# Aware — Student Mental Wellness App

> **Support in Seconds.** A minimalist mental health web app for students.

## Overview

Aware is a minimalist, highly accessible web application designed to support students in managing the immediate emotional pressures of academic life. Built with Next.js 15 and Supabase.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
cd Projects/Aware
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local .env.local.example  # backup the template
```

Then edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get these from: **Supabase Dashboard → Project Settings → API**

### 3. Set up the database

Run the initial schema migration in your Supabase SQL Editor:

```bash
# Option A: via Supabase CLI
supabase db push

# Option B: manually paste into Supabase SQL Editor
# Copy contents of: supabase/migrations/20240501_initial_schema.sql
```

### 4. Deploy the Edge Function (optional for MVP)

```bash
supabase functions deploy daily-resource-scheduler
```

Then set up a daily cron in the Supabase dashboard to call this function at 6 AM.

### 5. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
/
├── app/
│   ├── (auth)/              # Login, Signup pages
│   └── (app)/               # Authenticated app
│       ├── dashboard/       # Main dashboard + Daily Spark
│       ├── mood-log/        # Rapid mood tracking flow
│       ├── history/         # 7-day heatmap + trends
│       ├── favorites/       # Saved Daily Spark resources
│       └── settings/        # Account + privacy settings
│
├── components/
│   ├── layout/
│   │   ├── GlobalNav.tsx           # Bottom navigation bar
│   │   └── PersistentSOSButton.tsx # Fixed SOS crisis button
│   ├── mood/
│   │   ├── EmotionIconSet.tsx      # 5 mood face icons
│   │   ├── MoodHeatmap.tsx         # 7-day mood grid
│   │   └── MoodTagSelector.tsx     # Stressor tag chips
│   └── daily-spark/
│       └── DailyResourceCard.tsx   # Resource display + breathing exercise
│
├── lib/
│   ├── api/
│   │   ├── supabaseClient.ts       # Browser Supabase client
│   │   └── supabaseServer.ts       # Server-side Supabase client
│   ├── constants.ts                # Colors, moods, crisis resources, seed data
│   └── timeUtils.ts                # Time block logic, date helpers
│
├── supabase/
│   ├── migrations/
│   │   └── 20240501_initial_schema.sql  # Full DB schema
│   └── functions/
│       ├── daily-resource-scheduler/    # Edge function for daily Spark delivery
│       └── anon_aggregator.sql          # K-Anonymity aggregation function
│
├── types/index.ts                  # TypeScript types
└── middleware.ts                   # Auth route protection
```

---

## Key Features

### Mood Tracking
- 5 discrete emotion icons (Radiant → Struggling)
- Optional stressor tag cloud (Exams, Deadline, Sleep, Social, etc.)
- Auto-logged time block context (Morning, Evening, Late Night Study, etc.)
- "Logged. Thank you for checking in." confirmation screen

### Daily Spark
- One curated resource per day (affirmation, breathing exercise, guided reflection)
- **Burnout override:** if 3+ consecutive days of Drained/Struggling → burnout recovery resource
- In-app guided breathing exercises (4-7-8 and Box Breathing)
- Save to Favorites for later access

### SOS Emergency Button
- **Always visible** — fixed top-right on every screen
- Emergency Red (#D93025) — the only high-vibration color in the app
- Crisis modal: 988 Lifeline, Crisis Text Line, Campus support, Personal contact
- Uses native `tel:` and `sms:` protocols for one-tap calling/texting

### 7-Day Heatmap
- Color-coded by mood (Sage Green → Slate Blue → Muted Brown)
- Streak indicator
- Personal insights: avg mood, top stressor, log count

### Settings
- High-contrast accessibility mode
- Personal emergency contact configuration
- GDPR data export request
- Account deletion (Right to be Forgotten)
- MFA toggle

---

## Privacy & Compliance

| Regulation | Implementation |
|-----------|---------------|
| **FERPA** | Mood logs are never shared with academic institutions. RLS enforces user isolation. |
| **HIPAA** | TLS 1.3 in transit (Supabase default), encryption at rest, immutable audit logs. |
| **GDPR** | Explicit consent on signup, data export, Right to be Forgotten deletion flow. |

**Admin reporting** uses K-Anonymity: aggregates are only generated for populations > 50 users and never contain PII.

---

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Cream Base | `#FBF8F3` | Primary background |
| Sage Green | `#A0B89F` | Primary accent, positive states |
| Slate Blue | `#6E8B9D` | Secondary accent, information |
| Soft Grey | `#D3D3D3` | Dividers, inactive states |
| **Emergency Red** | `#D93025` | **SOS button ONLY** |

### Typography
- **Font:** Nunito (Google Fonts) — round, warm, highly legible
- **Min size:** 16px body, 14px captions
- **Line height:** 1.65–1.75× for all body copy
- **Min touch targets:** 48×48px on all interactive elements

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo in Vercel
3. Add env vars from `.env.local`
4. Deploy

### Environment Variables (Production)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.com
```
