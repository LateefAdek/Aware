"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MoodTagSelector from "@/components/mood/MoodTagSelector";
import { getMoodByCode, MOODS } from "@/lib/constants";
import { getTimeBlock } from "@/lib/timeUtils";
import type { MoodCode, StressorTag } from "@/types";

type Step = "select" | "tag" | "confirm";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

// ── Solid fill SVG mood faces ─────────────────────────────────────────────────
function MoodFace({ code, size = 64 }: { code: MoodCode; size?: number }) {
  const mood = getMoodByCode(code);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;
  const eyeY = cy - r * 0.18;
  const eyeXL = cx - r * 0.34;
  const eyeXR = cx + r * 0.34;
  const eyeR = r * 0.1;
  const mouthY = cy + r * 0.2;
  const mouthW = r * 0.48;

  const mouths: Record<number, React.ReactNode> = {
    1: <path d={`M ${cx - mouthW} ${mouthY} Q ${cx} ${mouthY + r * 0.42} ${cx + mouthW} ${mouthY}`}
          fill="none" stroke="white" strokeWidth={r * 0.13} strokeLinecap="round" />,
    2: <path d={`M ${cx - mouthW * 0.78} ${mouthY} Q ${cx} ${mouthY + r * 0.26} ${cx + mouthW * 0.78} ${mouthY}`}
          fill="none" stroke="white" strokeWidth={r * 0.12} strokeLinecap="round" />,
    3: <line x1={cx - mouthW * 0.65} y1={mouthY + r * 0.08} x2={cx + mouthW * 0.65} y2={mouthY + r * 0.08}
          stroke="white" strokeWidth={r * 0.12} strokeLinecap="round" />,
    4: <path d={`M ${cx - mouthW * 0.78} ${mouthY + r * 0.22} Q ${cx} ${mouthY - r * 0.1} ${cx + mouthW * 0.78} ${mouthY + r * 0.22}`}
          fill="none" stroke="white" strokeWidth={r * 0.12} strokeLinecap="round" />,
    5: <path d={`M ${cx - mouthW} ${mouthY + r * 0.32} Q ${cx} ${mouthY - r * 0.22} ${cx + mouthW} ${mouthY + r * 0.32}`}
          fill="none" stroke="white" strokeWidth={r * 0.13} strokeLinecap="round" />,
  };

  const fills: Record<number, string> = {
    1: "#5a9e57",
    2: "#7a9e79",
    3: "#6e8b9d",
    4: "#9e7a6e",
    5: "#805e5a",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={mood.label}
    >
      <circle cx={cx} cy={cy} r={r} fill={fills[code]} />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.3} r={r * 0.22}
        fill="white" opacity={0.15} />
      <circle cx={eyeXL} cy={eyeY} r={eyeR} fill="white" />
      <circle cx={eyeXR} cy={eyeY} r={eyeR} fill="white" />
      {mouths[code]}
      {code === 1 && <>
        <circle cx={cx - r * 0.78} cy={cy - r * 0.7} r={r * 0.07} fill="#a8d5a6" opacity={0.9} />
        <circle cx={cx + r * 0.78} cy={cy - r * 0.7} r={r * 0.07} fill="#a8d5a6" opacity={0.9} />
        <circle cx={cx} cy={cy - r * 1.06} r={r * 0.06} fill="#a8d5a6" opacity={0.8} />
      </>}
    </svg>
  );
}

// ── Stressor tags — defined locally with inclusive hand emoji ─────────────────
const STRESSOR_TAGS: { label: string; emoji: string }[] = [
  { label: "Exams",      emoji: "📝" },
  { label: "Deadline",   emoji: "⏰" },
  { label: "Sleep",      emoji: "😴" },
  { label: "Social",     emoji: "🤝🏿" },
  { label: "Family",     emoji: "🏠" },
  { label: "Finances",   emoji: "💸" },
  { label: "Health",     emoji: "🩺" },
  { label: "Classes",    emoji: "📚" },
  { label: "Workload",   emoji: "📋" },
  { label: "Loneliness", emoji: "🌧️" },
];

export default function MoodLogPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [selectedMood, setSelectedMood] = useState<MoodCode | null>(null);
  const [selectedTags, setSelectedTags] = useState<StressorTag[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredMood, setHoveredMood] = useState<MoodCode | null>(null);
  const [autoTimer, setAutoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMoodSelect = (code: MoodCode) => {
    setSelectedMood(code);
    setStep("tag");
    const t = setTimeout(() => handleSubmit(code, []), 5000);
    setAutoTimer(t);
  };

  const handleTagToggle = (tag: StressorTag) => {
    if (autoTimer) { clearTimeout(autoTimer); setAutoTimer(null); }
    setSelectedTags((p) =>
      p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]
    );
  };

  const handleSubmit = async (
    moodCode: MoodCode | null = selectedMood,
    tags: StressorTag[] = selectedTags
  ) => {
    if (!moodCode) return;
    if (autoTimer) clearTimeout(autoTimer);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setStep("confirm");
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  const mood = selectedMood ? getMoodByCode(selectedMood) : null;

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (step === "confirm" && mood) {
    return (
      <div style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        gap: "20px",
      }}>
        <div style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <MoodFace code={mood.code} size={96} />
        </div>

        <div>
          <h1 style={{
            fontSize: "24px", fontWeight: 700,
            color: "#1e293b", marginBottom: "6px",
            letterSpacing: "-0.02em",
          }}>
            Logged. Thank you for checking in.
          </h1>
          <div style={{
            height: "3px", borderRadius: "999px",
            background: GRADIENT,
            width: "80px", margin: "0 auto",
          }} />
        </div>

        <p style={{ fontSize: "15px", color: "#5a6e6e" }}>
          You logged:{" "}
          <span style={{ fontWeight: 700, color: mood.color }}>{mood.label}</span>
        </p>

        {selectedTags.length > 0 && (
          <div style={{
            display: "flex", gap: "6px",
            flexWrap: "wrap", justifyContent: "center",
          }}>
            {selectedTags.map((tag) => (
              <span key={tag} style={{
                padding: "4px 12px", borderRadius: "999px",
                backgroundColor: "#eef3f6",
                fontSize: "12px", fontWeight: 600, color: "#6e8b9d",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          borderRadius: "999px",
          background: "linear-gradient(135deg, rgba(199,184,234,0.2) 0%, rgba(95,168,211,0.2) 100%)",
          border: "1.5px solid rgba(95,168,211,0.3)",
        }}>
          <span style={{ fontSize: "14px" }}>🌿</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#7b5ea7" }}>
            Returning to dashboard…
          </span>
        </div>

        <style>{`
          @keyframes popIn {
            from { transform: scale(0.5); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // ── Main mood log flow ────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>

      {/* Header — fully centered */}
      <div style={{
        textAlign: "center",
        paddingTop: "16px",
        paddingBottom: "8px",
        marginBottom: "12px",
      }}>
        <p style={{
          fontSize: "13px", fontWeight: 600,
          color: "#8fa0a0", marginBottom: "8px",
        }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric",
          })}
        </p>
        <h1 style={{
          fontSize: "26px", fontWeight: 700,
          color: "#1e293b", letterSpacing: "-0.02em",
          marginBottom: "10px",
        }}>
          How are you feeling?
        </h1>
        {/* Gradient brand underline */}
        <div style={{
          height: "3px", borderRadius: "999px",
          background: GRADIENT,
          width: "60px", margin: "0 auto 20px",
        }} />
      </div>

      {/* Step progress bar */}
      <div style={{
        display: "flex", gap: "6px",
        marginBottom: "36px",
        padding: "0 8px",
      }}>
        {["select", "tag"].map((s, i) => (
          <div key={s} style={{
            flex: 1, height: "3px", borderRadius: "999px",
            background:
              (step === "tag" && i === 0) || step === "confirm"
                ? GRADIENT
                : step === "tag" && i === 1
                ? "linear-gradient(135deg, rgba(199,184,234,0.4) 0%, rgba(95,168,211,0.4) 100%)"
                : "#e0dbd3",
            transition: "background 0.4s ease",
          }} />
        ))}
      </div>

      {/* Mood icons — centered, with dimming on unselected */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "40px",
        padding: "0 4px",
      }}>
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.code;
          const isHovered = hoveredMood === m.code;
          // Dim unselected icons when one is chosen
          const isDimmed = selectedMood !== null && !isSelected;

          return (
            <button
              key={m.code}
              onClick={() => handleMoodSelect(m.code as MoodCode)}
              onMouseEnter={() => setHoveredMood(m.code as MoodCode)}
              onMouseLeave={() => setHoveredMood(null)}
              aria-label={`${m.label}: ${m.description}`}
              aria-pressed={isSelected}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                minHeight: "48px",
                minWidth: "48px",
                // Scale up on hover/select for tactile feedback
                transform: isSelected
                  ? "scale(1.18)"
                  : isHovered
                  ? "scale(1.1)"
                  : "scale(1)",
                transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, filter 0.2s ease, box-shadow 0.18s ease",
                // Grayscale + opacity on unselected — makes chosen mood stand out
                filter: isDimmed ? "grayscale(60%)" : "none",
                opacity: isDimmed ? 0.45 : 1,
                boxShadow: isSelected
                  ? `0 8px 24px ${m.color}40`
                  : isHovered
                  ? `0 4px 14px ${m.color}25`
                  : "none",
                backgroundColor: isSelected ? m.bgColor : "transparent",
              }}
            >
              <MoodFace code={m.code as MoodCode} size={64} />
              <span style={{
                fontSize: "11px",
                fontWeight: 700,
                color: isSelected ? m.color : "#8fa0a0",
                transition: "color 0.15s",
                letterSpacing: "0.02em",
              }}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected mood summary card — mb-8 separates it from tags */}
      {mood && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 18px",
          borderRadius: "16px",
          marginBottom: "32px",   // clear separation from tags section
          backgroundColor: mood.bgColor,
          border: `1.5px solid ${mood.borderColor}`,
          boxShadow: `0 4px 20px ${mood.color}20`,
        }}>
          <MoodFace code={mood.code} size={40} />
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: mood.color }}>
              {mood.label}
            </p>
            <p style={{ fontSize: "12px", color: "#5a6e6e" }}>
              {mood.description}
            </p>
          </div>
        </div>
      )}

      {/* Tags section */}
      {step === "tag" && (
        <div style={{ marginBottom: "28px" }}>
          <p style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#1e293b",
            textAlign: "center",
            marginBottom: "16px",
          }}>
            What&apos;s contributing? <span style={{ fontWeight: 400, color: "#8fa0a0" }}>(optional)</span>
          </p>

          {/* Tags — flex wrap centered, gap-3, no border, pill shape */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}>
            {STRESSOR_TAGS.map(({ label, emoji }) => {
              const isActive = selectedTags.includes(label as StressorTag);
              return (
                <button
                  key={label}
                  onClick={() => handleTagToggle(label as StressorTag)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    minHeight: "42px",
                    transition: "all 0.18s ease",
                    // Active: solid gradient — clear high-contrast feedback
                    background: isActive
                      ? GRADIENT
                      : "#f0ece5",   // light gray, no border — reduced visual noise
                    color: isActive ? "#ffffff" : "#5a6e6e",
                    boxShadow: isActive
                      ? "0 4px 14px rgba(95,168,211,0.3)"
                      : "none",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(199,184,234,0.25) 0%, rgba(95,168,211,0.25) 100%)";
                      e.currentTarget.style.color = "#7b5ea7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f0ece5";
                      e.currentTarget.style.color = "#5a6e6e";
                    }
                  }}
                >
                  <span style={{ fontSize: "15px" }}>{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit and skip buttons */}
      {step === "tag" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Log Mood — gradient, rounded-full, generous padding */}
          <button
            onClick={() => handleSubmit()}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "20px",               // generous vertical padding
              borderRadius: "999px",          // fully rounded — sleek pill
              border: "none",
              background: submitting ? "#d3d3d3" : GRADIENT,
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              minHeight: "58px",
              boxShadow: submitting ? "none" : "0 4px 18px rgba(95,168,211,0.35)",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.filter = "brightness(1.07)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(95,168,211,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(95,168,211,0.35)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
          >
            {submitting ? "Saving…" : "Log Mood"}
          </button>

          {/* Skip tags — more visible, medium gray, larger font */}
          <button
            onClick={() => handleSubmit(selectedMood, [])}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "999px",
              border: "1.5px solid #e0dbd3",
              background: "transparent",
              color: "#8fa0a0",              // medium gray — clearly visible
              fontSize: "14px",              // slightly larger than before
              fontWeight: 600,
              cursor: "pointer",
              minHeight: "50px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#5a6e6e";
              e.currentTarget.style.borderColor = "#c8c4be";
              e.currentTarget.style.backgroundColor = "#f7f4ef";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8fa0a0";
              e.currentTarget.style.borderColor = "#e0dbd3";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Skip tags
          </button>
        </div>
      )}

      {/* Initial tap prompt */}
      {step === "select" && (
        <p style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#8fa0a0",
          marginTop: "8px",
          fontWeight: 500,
        }}>
          Tap an icon to get started
        </p>
      )}
    </div>
  );
}