"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DailyResourceCard from "@/components/daily-spark/DailyResourceCard";
import MoodHeatmap from "@/components/mood/MoodHeatmap";
import { SEED_RESOURCES, MOODS } from "@/lib/constants";
import { getGreeting, formatDisplayDate, hasBurnoutPattern } from "@/lib/timeUtils";
import type { MoodLog, DailySparkResource } from "@/types";

const DEMO_LOGS: MoodLog[] = [
  {
    log_id: "1", user_id: "demo", mood_icon_code: 2,
    log_timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    time_block_context: "Morning", stressor_tags: ["Classes"],
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    log_id: "2", user_id: "demo", mood_icon_code: 3,
    log_timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    time_block_context: "Evening", stressor_tags: ["Exams"],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    log_id: "3", user_id: "demo", mood_icon_code: 1,
    log_timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    time_block_context: "Afternoon", stressor_tags: null,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    log_id: "4", user_id: "demo", mood_icon_code: 4,
    log_timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    time_block_context: "Late Night Study", stressor_tags: ["Deadline", "Sleep"],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    log_id: "5", user_id: "demo", mood_icon_code: 4,
    log_timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    time_block_context: "Evening", stressor_tags: ["Exams"],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    log_id: "6", user_id: "demo", mood_icon_code: 2,
    log_timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    time_block_context: "Morning", stressor_tags: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

function getDailyResource(logs: MoodLog[]): DailySparkResource {
  const recentCodes = logs.slice(-5).map((l) => l.mood_icon_code).reverse();
  const isBurnout = hasBurnoutPattern(recentCodes);
  if (isBurnout) {
    const burnout = SEED_RESOURCES.find((r) => r.resource_type === "BURNOUT_RECOVERY");
    if (burnout) return { ...burnout, is_burnout_override: true };
  }
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const nonBurnout = SEED_RESOURCES.filter((r) => r.resource_type !== "BURNOUT_RECOVERY");
  return { ...nonBurnout[dayOfYear % nonBurnout.length], is_burnout_override: false };
}

// Shared card style — consistent border radius and shadow everywhere
const cardStyle: React.CSSProperties = {
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  border: "1.5px solid #e0dbd3",
  boxShadow: "0 2px 16px rgba(45,58,58,0.06)",
  padding: "24px",
};

export default function DashboardPage() {
  const [logs] = useState<MoodLog[]>(DEMO_LOGS);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [greeting, setGreeting] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [loggedToday, setLoggedToday] = useState(false);

  const dailyResource = getDailyResource(logs);

  useEffect(() => {
    setGreeting(getGreeting());
    setTodayDate(formatDisplayDate(new Date()));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setLoggedToday(logs.some((l) => new Date(l.log_timestamp) >= today));
  }, [logs]);

  const handleFavorite = (resourceId: number) => {
    setFavorites((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <div style={{ paddingTop: "8px" }}>
        <p style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#8fa0a0",
          marginBottom: "4px",
        }}>
          {todayDate}
        </p>
        <h1 style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#1e293b",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}>
          {greeting} 👋
        </h1>
      </div>

      {/* ── MOOD CTA ─────────────────────────────────────────────── */}
      {!loggedToday ? (
        <Link href="/mood-log" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderRadius: "20px",
              padding: "28px 24px",
              // Dark overlay ensures text contrast — fixes WCAG issue
              background: "linear-gradient(135deg, #3d5a3e 0%, #2d4a5a 100%)",
              boxShadow: "0 6px 24px rgba(45,58,58,0.22)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 32px rgba(45,58,58,0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(45,58,58,0.22)";
            }}
          >
            <div>
              {/* High contrast dark text on dark background — fully WCAG compliant */}
              <p style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "6px",
                lineHeight: 1.3,
              }}>
                How are you feeling right now?
              </p>
              <p style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.80)",
                fontWeight: 500,
              }}>
                Tap to log your mood — takes 5 seconds
              </p>
            </div>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              flexShrink: 0,
            }}>
              😊
            </div>
          </div>
        </Link>
      ) : (
        <div style={{
          ...cardStyle,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#eef5ed",
          border: "1.5px solid #a0b89f",
        }}>
          <span style={{ fontSize: "22px" }}>✅</span>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#2d5a2c" }}>
              Today&apos;s check-in logged
            </p>
            <Link href="/mood-log" style={{
              fontSize: "12px", fontWeight: 600,
              color: "#5a9e57", textDecoration: "none",
            }}>
              Log again →
            </Link>
          </div>
        </div>
      )}

      {/* ── MOOD LEGEND ──────────────────────────────────────────── */}
      {/* Unified icon legend — matches tracker exactly */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#8fa0a0", marginRight: "4px" }}>
          Mood key:
        </span>
        {MOODS.map((mood) => (
          <div
            key={mood.code}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: mood.bgColor,
              border: `1.5px solid ${mood.borderColor}`,
            }}
          >
            <span style={{ fontSize: "12px" }}>{mood.emoji}</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: mood.color }}>
              {mood.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── DAILY SPARK ───────────────────────────────────────────── */}
      <section>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
            Today&apos;s Spark
          </h2>
          <span style={{
            fontSize: "11px", fontWeight: 700,
            padding: "4px 10px", borderRadius: "999px",
            backgroundColor: "#f0ece5", color: "#8fa0a0",
            letterSpacing: "0.06em",
          }}>
            DAILY
          </span>
        </div>
        <DailyResourceCard
          resource={dailyResource}
          isFavorited={favorites.includes(dailyResource.resource_id)}
          onFavorite={handleFavorite}
        />
      </section>

      {/* ── 7-DAY HEATMAP ─────────────────────────────────────────── */}
      <section>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
            Your week
          </h2>
          <Link href="/history" style={{
            fontSize: "12px", fontWeight: 700,
            color: "#6e8b9d", textDecoration: "none",
          }}>
            View history →
          </Link>
        </div>

        {/* Consistent border-radius matches all other cards */}
        <div style={{ ...cardStyle, padding: "20px" }}>
          <MoodHeatmap logs={logs} />
        </div>
      </section>

      {/* ── TIP OF THE DAY ────────────────────────────────────────── */}
      <section>
        <div style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "20px 24px",
          borderRadius: "20px",
          backgroundColor: "#eef3f6",
          border: "1.5px solid #a8c0ce",
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#d4e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
          }}>
            💡
          </div>
          <div>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#6e8b9d",
              letterSpacing: "0.08em",
              marginBottom: "5px",
            }}>
              TIP OF THE DAY
            </p>
            <p style={{
              fontSize: "14px",
              color: "#4e6a7a",
              lineHeight: 1.75,
            }}>
              Checking in daily — even when things feel okay — helps you spot patterns before they become problems.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}