"use client";

import { useState, useEffect, useCallback } from "react";
import type { DailySparkResource } from "@/types";

interface DailyResourceCardProps {
  resource: DailySparkResource;
  isFavorited?: boolean;
  onFavorite?: (resourceId: number) => void;
  onEngagementComplete?: () => void;
}

const RESOURCE_ICONS: Record<string, string> = {
  AFFIRMATION: "✨",
  BREATHING_EXERCISE: "🌬️",
  GUIDED_REFLECTION: "🪞",
  BURNOUT_RECOVERY: "🌱",
};

const RESOURCE_LABELS: Record<string, string> = {
  AFFIRMATION: "Daily Affirmation",
  BREATHING_EXERCISE: "Breathing Exercise",
  GUIDED_REFLECTION: "Guided Reflection",
  BURNOUT_RECOVERY: "Burnout Recovery",
};

// ── Circular progress ring ────────────────────────────────────────────────────
function CircularProgress({
  duration,
  elapsed,
  size = 180,
}: {
  duration: number;
  elapsed: number;
  size?: number;
}) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = elapsed / duration;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(110,139,157,0.15)"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#6e8b9d"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}

// ── Breathing exercise component ──────────────────────────────────────────────
function BreathingExercise({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const phases = [
    { label: "Inhale",  instruction: "Breathe in slowly…",    duration: 4,  color: "#a0b89f", scale: 1.35 },
    { label: "Hold",    instruction: "Hold gently…",           duration: 7,  color: "#6e8b9d", scale: 1.35 },
    { label: "Exhale",  instruction: "Release completely…",    duration: 8,  color: "#9e7a6e", scale: 0.85 },
  ];

  const totalCycles = 3;
  const ORB_SIZE = 180;

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [done, setDone] = useState(false);
  const [labelVisible, setLabelVisible] = useState(true);

  const currentPhase = phases[phaseIndex];
  const countdown = currentPhase.duration - elapsed;

  // Haptic feedback on phase change
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= currentPhase.duration) {
          // Move to next phase
          const nextPhase = (phaseIndex + 1) % phases.length;
          if (nextPhase === 0) {
            const nextCycle = cycle + 1;
            if (nextCycle >= totalCycles) {
              clearInterval(timer);
              setTimeout(() => setDone(true), 400);
              return e;
            }
            setCycle(nextCycle);
          }
          // Fade label out then back in
          setLabelVisible(false);
          setTimeout(() => {
            setPhaseIndex(nextPhase);
            setElapsed(0);
            setLabelVisible(true);
            triggerHaptic();
          }, 300);
          return e;
        }
        return e + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseIndex, cycle, currentPhase.duration, triggerHaptic]);

  // Orb scale based on phase
  const orbScale = elapsed === 0 ? 1 : currentPhase.scale;
  const transitionDuration = `${currentPhase.duration}s`;

  if (done) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 0",
        gap: "12px",
        animation: "fadeIn 0.6s ease forwards",
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "#eef5ed",
          border: "3px solid #a0b89f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}>
          🌿
        </div>
        <p style={{ fontSize: "18px", fontWeight: 700, color: "#2d3a3a" }}>
          Well done
        </p>
        <p style={{ fontSize: "14px", color: "#5a6e6e", textAlign: "center", lineHeight: 1.6 }}>
          Take a moment to notice how you feel. Your nervous system is calmer now.
        </p>
        <button
          onClick={onComplete}
          style={{
            marginTop: "8px",
            padding: "12px 28px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#a0b89f",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            minHeight: "48px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Return to dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "28px",
      padding: "16px 0 8px",
    }}>

      {/* Phase label — fades between phases */}
      <div style={{
        textAlign: "center",
        opacity: labelVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
        minHeight: "48px",
      }}>
        <p style={{
          fontSize: "26px",
          fontWeight: 700,
          color: currentPhase.color,
          letterSpacing: "-0.02em",
          marginBottom: "4px",
          transition: "color 0.4s ease",
        }}>
          {currentPhase.label}
        </p>
        <p style={{ fontSize: "14px", color: "#5a6e6e" }}>
          {currentPhase.instruction}
        </p>
      </div>

      {/* Breathing orb with circular progress ring */}
      <div style={{
        position: "relative",
        width: `${ORBS_SIZE}px`,
        height: `${ORBS_SIZE}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Circular progress ring */}
        <CircularProgress
          duration={currentPhase.duration}
          elapsed={elapsed}
          size={ORBS_SIZE}
        />

        {/* Animated orb */}
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: currentPhase.color,
          opacity: 0.25,
          position: "absolute",
          transform: `scale(${orbScale})`,
          transition: `transform ${transitionDuration} ease-in-out`,
        }} />
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: currentPhase.color,
          opacity: 0.5,
          position: "absolute",
          transform: `scale(${orbScale * 0.85})`,
          transition: `transform ${transitionDuration} ease-in-out`,
        }} />

        {/* Countdown number in centre */}
        <div style={{
          position: "relative",
          zIndex: 2,
          fontSize: "36px",
          fontWeight: 700,
          color: currentPhase.color,
          lineHeight: 1,
        }}>
          {countdown}
        </div>
      </div>

      {/* Cycle indicator dots */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {Array.from({ length: totalCycles }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === cycle ? "20px" : "8px",
              height: "8px",
              borderRadius: "999px",
              backgroundColor: i <= cycle ? "#6e8b9d" : "#d3d3d3",
              transition: "all 0.3s ease",
            }}
          />
        ))}
        <span style={{ fontSize: "12px", color: "#8fa0a0", marginLeft: "4px" }}>
          Cycle {cycle + 1} of {totalCycles}
        </span>
      </div>

    </div>
  );
}

// ── Main DailyResourceCard ────────────────────────────────────────────────────
const ORBS_SIZE = 180;

export default function DailyResourceCard({
  resource,
  isFavorited = false,
  onFavorite,
  onEngagementComplete,
}: DailyResourceCardProps) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);
  const [dimBackground, setDimBackground] = useState(false);

  const handleStartBreathing = () => {
    setIsBreathing(true);
    setDimBackground(true);
    // Haptic on start
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([60, 40, 60]);
    }
  };

  const handleBreathingComplete = () => {
    setIsBreathing(false);
    setDimBackground(false);
    setCompleted(true);
    onEngagementComplete?.();
  };

  const handleFavorite = () => {
    setFavorited((f) => !f);
    onFavorite?.(resource.resource_id);
  };

  const icon = RESOURCE_ICONS[resource.resource_type] ?? "🌿";
  const typeLabel = RESOURCE_LABELS[resource.resource_type] ?? "Daily Spark";

  // Completion state
  if (completed) {
    return (
      <div style={{
        borderRadius: "20px",
        padding: "32px 24px",
        textAlign: "center",
        backgroundColor: "#eef5ed",
        border: "1.5px solid #a0b89f",
        animation: "fadeIn 0.5s ease forwards",
      }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌿</div>
        <p style={{ fontWeight: 700, fontSize: "16px", color: "#2d5a2c", marginBottom: "6px" }}>
          Exercise complete
        </p>
        <p style={{ fontSize: "14px", color: "#5a6e6e", lineHeight: 1.6 }}>
          Well done. Take a moment to notice how you feel.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Background dim overlay — focus mode */}
      {dimBackground && (
        <div
          onClick={() => {
            setDimBackground(false);
            setIsBreathing(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(45, 58, 58, 0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 50,
            cursor: "pointer",
          }}
        />
      )}

      {/* Card */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: resource.is_burnout_override ? "#f4edec" : "#ffffff",
          border: resource.is_burnout_override
            ? "1.5px solid #b09896"
            : "1.5px solid #e0dbd3",
          boxShadow: "0 2px 16px rgba(45,58,58,0.07)",
          position: dimBackground ? "relative" : "static",
          zIndex: dimBackground ? 60 : "auto",
        }}
      >
        {/* Card header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid",
          borderColor: resource.is_burnout_override ? "#c4a8a0" : "#e0dbd3",
          backgroundColor: resource.is_burnout_override ? "#f0e5e3" : "#f7f4ef",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: resource.is_burnout_override ? "#805e5a" : "#8fa0a0",
            }}>
              {typeLabel.toUpperCase()}
            </span>
            {resource.is_burnout_override && (
              <span style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: "#805e5a",
                color: "#ffffff",
                fontWeight: 700,
              }}>
                Burnout Support
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              minHeight: "48px",
              minWidth: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={favorited ? "#a0b89f" : "none"}
              stroke={favorited ? "#a0b89f" : "#d3d3d3"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Card body */}
        <div style={{ padding: "24px" }}>
          <h3 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#2d3a3a",
            letterSpacing: "-0.01em",
            marginBottom: "16px",
          }}>
            {resource.title}
          </h3>

          {isBreathing ? (
            <BreathingExercise onComplete={handleBreathingComplete} />
          ) : (
            <>
              <p style={{
                fontSize: "15px",
                color: "#5a6e6e",
                lineHeight: 1.75,
                marginBottom: "20px",
              }}>
                {resource.content_body}
              </p>

              {resource.resource_type === "BREATHING_EXERCISE" && (
                <button
                  onClick={handleStartBreathing}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    backgroundColor: "#6e8b9d",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: "52px",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 14px rgba(110,139,157,0.3)",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#5a7a8d";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(110,139,157,0.4)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#6e8b9d";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(110,139,157,0.3)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                >
                  Begin guided exercise
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}