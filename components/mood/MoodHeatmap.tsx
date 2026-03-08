"use client";

import { getMoodByCode, MOODS } from "@/lib/constants";
import { getLastNDays, getShortDay, isSameDay } from "@/lib/timeUtils";
import type { MoodLog } from "@/types";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

interface MoodHeatmapProps {
  logs: MoodLog[];
  days?: number;
}

// ── Mood Key — horizontal pill row with gradient borders ──────────────────────
export function MoodKey() {
  return (
    <div
      role="legend"
      aria-label="Mood key — five emotional energy levels"
      style={{
        padding: "18px 20px",
        borderRadius: "20px",
        backgroundColor: "#ffffff",
        border: "1.5px solid #e0dbd3",
        boxShadow: "0 2px 16px rgba(45,58,58,0.06)",
      }}
    >
      <p style={{
        fontSize: "11px", fontWeight: 700,
        letterSpacing: "0.08em", color: "#8fa0a0",
        marginBottom: "12px",
      }}>
        MOOD KEY — 5 LEVELS
      </p>

      {/* Horizontal scrollable pill row */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        {MOODS.map((mood) => (
          <div
            key={mood.code}
            role="img"
            aria-label={`${mood.label}: ${mood.description}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 14px",
              borderRadius: "999px",
              backgroundColor: mood.bgColor,
              // Gradient border via box-shadow trick
              boxShadow: `0 0 0 2px ${mood.borderColor}, 0 2px 8px rgba(95,168,211,0.10)`,
              cursor: "default",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                `0 0 0 2px ${mood.borderColor}, 0 6px 16px rgba(95,168,211,0.2)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                `0 0 0 2px ${mood.borderColor}, 0 2px 8px rgba(95,168,211,0.10)`;
            }}
          >
            <span aria-hidden="true" style={{ fontSize: "16px", lineHeight: 1 }}>
              {mood.emoji}
            </span>
            <div>
              <p style={{
                fontSize: "13px", fontWeight: 700,
                color: mood.color, lineHeight: 1, marginBottom: "2px",
              }}>
                {mood.label}
              </p>
              <p style={{
                fontSize: "10px", fontWeight: 500,
                color: "#8fa0a0", lineHeight: 1,
              }}>
                {mood.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────
function getMoodForDay(logs: MoodLog[], day: Date) {
  const dayLogs = logs.filter((log) =>
    isSameDay(new Date(log.log_timestamp), day)
  );
  if (dayLogs.length === 0) return null;
  return dayLogs.sort(
    (a, b) =>
      new Date(b.log_timestamp).getTime() - new Date(a.log_timestamp).getTime()
  )[0].mood_icon_code;
}

// ── Main Heatmap ──────────────────────────────────────────────────────────────
export default function MoodHeatmap({ logs, days = 7 }: MoodHeatmapProps) {
  // Always exactly 7 days — Sunday included
  const lastNDays = getLastNDays(days);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = (() => {
    let count = 0;
    for (let i = lastNDays.length - 1; i >= 0; i--) {
      const hasLog = logs.some((log) =>
        isSameDay(new Date(log.log_timestamp), lastNDays[i])
      );
      if (hasLog) count++;
      else break;
    }
    return count;
  })();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* 7-day grid — full 7 days, always */}
      <div
        role="grid"
        aria-label="7-day mood tracker"
        style={{
          display: "flex",
          gap: "6px",
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {lastNDays.map((day, i) => {
          const moodCode = getMoodForDay(logs, day);
          const mood = moodCode ? getMoodByCode(moodCode) : null;
          const isToday = isSameDay(day, today);
          const dayLabel = getShortDay(day).toUpperCase();
          const cellAriaLabel = mood
            ? `${dayLabel}: ${mood.label} — ${mood.description}`
            : isToday
            ? `${dayLabel}: No entry yet — tap + to log`
            : `${dayLabel}: No entry`;

          return (
            // Each day: flex-col — icon directly above label, 1:1 relationship
            <div
              key={i}
              role="gridcell"
              aria-label={cellAriaLabel}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                minWidth: 0,
              }}
            >
              {/* Mood bubble */}
              <div
                title={cellAriaLabel}
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "14px",
                  // Today with no log — dashed border placeholder
                  backgroundColor: mood
                    ? mood.bgColor
                    : isToday
                    ? "rgba(95,168,211,0.06)"
                    : "#f0ece5",
                  border: mood
                    ? `2px solid ${mood.borderColor}`
                    : isToday
                    ? "2px dashed #5FA8D3"   // dashed hollow placeholder for today
                    : "2px dashed #e0dbd3",
                  boxShadow: isToday && !mood
                    ? "0 0 0 3px rgba(95,168,211,0.12)"
                    : isToday && mood
                    ? `0 0 0 3px rgba(95,168,211,0.18)`
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  transition: "transform 0.15s ease",
                }}
              >
                {mood ? (
                  <span aria-hidden="true">{mood.emoji}</span>
                ) : isToday ? (
                  // Gradient + for today with no log
                  <span style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    background: GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    +
                  </span>
                ) : null}
              </div>

              {/* Day label — directly under its bubble */}
              <span
                aria-hidden="true"
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isToday ? "#5FA8D3" : "#8fa0a0",
                  whiteSpace: "nowrap",
                }}
              >
                {dayLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer — justify-between ensures streak and legend never overlap */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: "12px",
        flexWrap: "wrap",
      }}>
        {/* Streak badge — far left */}
        <div
          role="status"
          aria-label={streak > 0 ? `${streak}-day streak` : "No streak yet"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: streak > 0
              ? "linear-gradient(135deg, rgba(199,184,234,0.2) 0%, rgba(95,168,211,0.2) 100%)"
              : "#f0ece5",
            border: streak > 0
              ? "1.5px solid rgba(95,168,211,0.3)"
              : "1.5px solid #e0dbd3",
            flexShrink: 0,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "14px" }}>
            {streak > 0 ? "🔥" : "💤"}
          </span>
          <span style={{
            fontSize: "12px",
            fontWeight: 700,
            color: streak > 0 ? "#7b5ea7" : "#8fa0a0",
            whiteSpace: "nowrap",
          }}>
            {streak > 0 ? `${streak}-day streak` : "Start your streak today"}
          </span>
        </div>

        {/* Compact legend — far right, never overlaps */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}>
          {[1, 3, 5].map((code) => {
            const mood = getMoodByCode(code);
            return (
              <div key={code} style={{
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                <div style={{
                  width: "16px", height: "16px",
                  borderRadius: "5px",
                  backgroundColor: mood.bgColor,
                  border: `2px solid ${mood.borderColor}`,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "9px",
                }}>
                  {mood.emoji}
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: 600,
                  color: mood.color, opacity: 1,
                  whiteSpace: "nowrap",
                }}>
                  {mood.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}