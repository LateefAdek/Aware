"use client";

import React, { useState } from "react";
import { getMoodByCode } from "@/lib/constants";
import MoodHeatmap from "@/components/mood/MoodHeatmap";
import type { MoodLog, MoodCode } from "@/types";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

function getDemoLogs(): MoodLog[] {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(13, 27, 0, 0);

  // code typed as MoodCode — fixes the type error
  const entry = (
    id: string,
    daysFromMonday: number,
    code: MoodCode,
    timeBlock: string,
    tags: string[] | null
  ): MoodLog => {
    const ts = new Date(monday);
    ts.setDate(monday.getDate() + daysFromMonday);
    return {
      log_id: id,
      user_id: "demo",
      mood_icon_code: code,
      log_timestamp: ts.toISOString(),
      time_block_context: timeBlock,
      stressor_tags: tags,
      created_at: ts.toISOString(),
    };
  };

  return [
    entry("1", 0, 2, "Morning",         ["Classes"]),
    entry("2", 1, 3, "Afternoon",        null),
    entry("3", 2, 1, "Morning",          ["Classes"]),
    entry("4", 3, 4, "Late Night Study", ["Exams", "Deadline"]),
    entry("5", 4, 5, "Evening",          ["Exams", "Sleep"]),
    entry("6", 5, 2, "Afternoon",        null),
  ];
}

const DEMO_LOGS = getDemoLogs();

const cardStyle: React.CSSProperties = {
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  border: "1.5px solid #e0dbd3",
  boxShadow: "0 2px 16px rgba(45,58,58,0.06)",
  padding: "20px",
};

function formatEntryDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatEntryTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function InsightCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      ...cardStyle,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      textAlign: "center",
    }}>
      <p style={{
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#8fa0a0",
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}

export default function HistoryPage() {
  const [logs] = useState<MoodLog[]>(DEMO_LOGS);

  const avgMoodCode = logs.length
    ? Math.round(logs.reduce((s, l) => s + l.mood_icon_code, 0) / logs.length)
    : 3;
  const avgMoodData = getMoodByCode(avgMoodCode);

  const tagCounts: Record<string, number> = {};
  logs.forEach((l) =>
    l.stressor_tags?.forEach((t) => {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1;
    })
  );
  const topStressor = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])[0] ?? null;

  const sortedLogs = [...logs].sort(
    (a, b) =>
      new Date(b.log_timestamp).getTime() - new Date(a.log_timestamp).getTime()
  );

  const morningCodes = logs
    .filter((l) =>
      l.time_block_context?.toLowerCase().includes("morning") ||
      l.time_block_context?.toLowerCase().includes("afternoon")
    )
    .map((l) => l.mood_icon_code);

  const eveningCodes = logs
    .filter((l) =>
      l.time_block_context?.toLowerCase().includes("evening") ||
      l.time_block_context?.toLowerCase().includes("night")
    )
    .map((l) => l.mood_icon_code);

  const morningAvg = morningCodes.length
    ? morningCodes.reduce((s, c) => s + c, 0) / morningCodes.length
    : null;
  const eveningAvg = eveningCodes.length
    ? eveningCodes.reduce((s, c) => s + c, 0) / eveningCodes.length
    : null;

  const showFatigue =
    morningAvg !== null &&
    eveningAvg !== null &&
    eveningAvg - morningAvg >= 1.5;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────── */}
      <div style={{ paddingTop: "8px" }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#1e293b",
          letterSpacing: "-0.02em",
          marginBottom: "6px",
        }}>
          Your Trends
        </h1>
        <div style={{
          height: "3px",
          borderRadius: "999px",
          background: GRADIENT,
          width: "48px",
        }} />
      </div>

      {/* ── ACADEMIC FATIGUE BANNER ───────────────────────────────── */}
      {showFatigue && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(199,184,234,0.15) 0%, rgba(95,168,211,0.15) 100%)",
          border: "1.5px solid rgba(95,168,211,0.25)",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "20px", flexShrink: 0 }}>📖</span>
          <div>
            <p style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#7b5ea7",
              marginBottom: "4px",
            }}>
              Pattern detected this week
            </p>
            <p style={{
              fontSize: "13px",
              color: "#4e6a7a",
              lineHeight: 1.6,
            }}>
              You tend to feel <strong>Content or Radiant</strong> in the mornings,
              but your mood dips in the evenings — especially around{" "}
              <strong>Exams</strong> and late-night study sessions. This is a
              common sign of academic fatigue.
            </p>
          </div>
        </div>
      )}

      {/* ── LAST 7 DAYS HEATMAP ──────────────────────────────────── */}
      <section aria-labelledby="heatmap-heading">
        <h2
          id="heatmap-heading"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#8fa0a0",
            marginBottom: "14px",
          }}
        >
          LAST 7 DAYS
        </h2>
        <div style={cardStyle}>
          <MoodHeatmap logs={logs} />
        </div>
      </section>

      {/* ── INSIGHTS ─────────────────────────────────────────────── */}
      <section aria-labelledby="insights-heading" style={{ marginTop: "8px" }}>
        <h2
          id="insights-heading"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#8fa0a0",
            marginBottom: "14px",
          }}
        >
          INSIGHTS
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}>

          {/* Average mood */}
          <InsightCard label="AVG MOOD">
            <div style={{
              width: "48px", height: "48px",
              borderRadius: "50%",
              backgroundColor: avgMoodData.bgColor,
              border: `2px solid ${avgMoodData.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}>
              {avgMoodData.emoji}
            </div>
            <p style={{
              fontSize: "14px",
              fontWeight: 700,
              color: avgMoodData.color,
            }}>
              {avgMoodData.label}
            </p>
          </InsightCard>

          {/* Total entries */}
          <InsightCard label="ENTRIES">
            <p style={{
              fontSize: "40px",
              fontWeight: 700,
              lineHeight: 1,
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {logs.length}
            </p>
            <p style={{ fontSize: "13px", color: "#8fa0a0", fontWeight: 500 }}>
              this week
            </p>
          </InsightCard>

          {/* Common stressor */}
          {topStressor && (
            <div style={{
              ...cardStyle,
              gridColumn: "1 / -1",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}>
              <div style={{
                width: "44px", height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, rgba(199,184,234,0.2) 0%, rgba(95,168,211,0.2) 100%)",
                border: "1.5px solid rgba(95,168,211,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}>
                📝
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#8fa0a0",
                  marginBottom: "4px",
                }}>
                  COMMON STRESSOR
                </p>
                <p style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1e293b",
                }}>
                  {topStressor[0]}
                </p>
              </div>
              <div style={{
                padding: "6px 12px",
                borderRadius: "999px",
                background: GRADIENT,
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
                flexShrink: 0,
              }}>
                ×{topStressor[1]} this week
              </div>
            </div>
          )}

          {/* Morning vs Evening */}
          {showFatigue && morningAvg !== null && eveningAvg !== null && (
            <div style={{
              ...cardStyle,
              gridColumn: "1 / -1",
              display: "flex",
              gap: "0",
              overflow: "hidden",
              padding: "0",
            }}>
              {[
                {
                  period: "Mornings",
                  emoji: "🌤️",
                  mood: getMoodByCode(Math.round(morningAvg)),
                  bg: "#f7fdf6",
                },
                {
                  period: "Evenings",
                  emoji: "🌙",
                  mood: getMoodByCode(Math.round(eveningAvg)),
                  bg: "#f4f0fb",
                },
              ].map((item, i) => (
                <div
                  key={item.period}
                  style={{
                    flex: 1,
                    padding: "16px",
                    backgroundColor: item.bg,
                    borderRight: i === 0 ? "1px solid #e0dbd3" : "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                  <p style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "#8fa0a0",
                  }}>
                    {item.period.toUpperCase()}
                  </p>
                  <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "50%",
                    backgroundColor: item.mood.bgColor,
                    border: `2px solid ${item.mood.borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}>
                    {item.mood.emoji}
                  </div>
                  <p style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: item.mood.color,
                  }}>
                    {item.mood.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RECENT ENTRIES ───────────────────────────────────────── */}
      <section aria-labelledby="entries-heading">
        <h2
          id="entries-heading"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#8fa0a0",
            marginBottom: "14px",
          }}
        >
          RECENT ENTRIES
        </h2>

        <div style={{ ...cardStyle, padding: "0", overflow: "hidden" }}>
          {sortedLogs.map((log, i) => {
            const mood = getMoodByCode(log.mood_icon_code);
            const isLast = i === sortedLogs.length - 1;
            const isEvening =
              log.time_block_context?.toLowerCase().includes("evening") ||
              log.time_block_context?.toLowerCase().includes("night");

            return (
              <div
                key={log.log_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 20px",
                  borderBottom: isLast ? "none" : "1px solid #f5f2ef",
                  transition: "background-color 0.15s ease",
                  backgroundColor: isEvening ? "#fdf9f7" : "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "#faf8f5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    isEvening ? "#fdf9f7" : "transparent";
                }}
              >
                <div style={{
                  width: "44px", height: "44px",
                  borderRadius: "14px",
                  backgroundColor: mood.bgColor,
                  border: `1.5px solid ${mood.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                }}>
                  {mood.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "3px",
                  }}>
                    <p style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: mood.color,
                    }}>
                      {mood.label}
                    </p>
                    <p style={{
                      fontSize: "11px",
                      color: "#8fa0a0",
                      fontWeight: 500,
                      flexShrink: 0,
                      marginLeft: "8px",
                    }}>
                      {formatEntryTime(log.log_timestamp)}
                    </p>
                  </div>

                  <p style={{
                    fontSize: "12px",
                    color: "#8fa0a0",
                    marginBottom: log.stressor_tags?.length ? "6px" : 0,
                  }}>
                    {formatEntryDate(log.log_timestamp)}
                    {log.time_block_context && (
                      <span style={{ color: isEvening ? "#9e7a6e" : "#8fa0a0" }}>
                        {` · ${log.time_block_context}`}
                      </span>
                    )}
                  </p>

                  {log.stressor_tags && log.stressor_tags.length > 0 && (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {log.stressor_tags.map((tag) => (
                        <span key={tag} style={{
                          padding: "2px 8px",
                          borderRadius: "999px",
                          backgroundColor: "#f0ece5",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#6e8b9d",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sortedLogs.length === 0 && (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#8fa0a0",
            }}>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>📭</p>
              <p style={{ fontSize: "14px", fontWeight: 600 }}>
                No entries yet — log your first mood!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── PRIVACY FOOTER ───────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        paddingBottom: "8px",
      }}>
        <span style={{ fontSize: "12px", opacity: 0.45 }}>🔒</span>
        <p style={{
          fontSize: "12px",
          color: "#8fa0a0",
          fontStyle: "italic",
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          Your mood data is private, encrypted, and never shared with your university.
        </p>
      </div>

    </div>
  );
}