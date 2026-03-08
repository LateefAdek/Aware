"use client";

import { MOODS } from "@/lib/constants";
import type { MoodCode, MoodDefinition } from "@/types";

// SVG Mood Faces — simple, flat, symbolic
function MoodFaceSVG({ code, size = 40 }: { code: MoodCode; size?: number }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.42;

  // Eye positions
  const eyeY = cy - r * 0.18;
  const eyeXL = cx - r * 0.36;
  const eyeXR = cx + r * 0.36;
  const eyeR = r * 0.1;

  // Mouth paths by code
  const mouthY = cy + r * 0.22;
  const mouthW = r * 0.52;

  const mouths: Record<MoodCode, React.ReactNode> = {
    1: (
      // Big smile
      <path
        d={`M ${cx - mouthW} ${mouthY} Q ${cx} ${mouthY + r * 0.45} ${cx + mouthW} ${mouthY}`}
        fill="none"
        strokeWidth={r * 0.14}
        strokeLinecap="round"
      />
    ),
    2: (
      // Gentle smile
      <path
        d={`M ${cx - mouthW * 0.8} ${mouthY} Q ${cx} ${mouthY + r * 0.28} ${cx + mouthW * 0.8} ${mouthY}`}
        fill="none"
        strokeWidth={r * 0.12}
        strokeLinecap="round"
      />
    ),
    3: (
      // Straight line
      <line
        x1={cx - mouthW * 0.7}
        y1={mouthY + r * 0.08}
        x2={cx + mouthW * 0.7}
        y2={mouthY + r * 0.08}
        strokeWidth={r * 0.12}
        strokeLinecap="round"
      />
    ),
    4: (
      // Slight frown
      <path
        d={`M ${cx - mouthW * 0.8} ${mouthY + r * 0.22} Q ${cx} ${mouthY - r * 0.12} ${cx + mouthW * 0.8} ${mouthY + r * 0.22}`}
        fill="none"
        strokeWidth={r * 0.12}
        strokeLinecap="round"
      />
    ),
    5: (
      // Sad frown
      <path
        d={`M ${cx - mouthW} ${mouthY + r * 0.3} Q ${cx} ${mouthY - r * 0.25} ${cx + mouthW} ${mouthY + r * 0.3}`}
        fill="none"
        strokeWidth={r * 0.14}
        strokeLinecap="round"
      />
    ),
  };

  const mood = MOODS.find((m) => m.code === code)!;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      role="img"
      aria-label={mood.label}
    >
      {/* Face circle */}
      <circle cx={cx} cy={cy} r={r} fill={mood.bgColor} stroke={mood.color} strokeWidth={r * 0.1} />
      {/* Eyes */}
      <circle cx={eyeXL} cy={eyeY} r={eyeR} fill={mood.color} />
      <circle cx={eyeXR} cy={eyeY} r={eyeR} fill={mood.color} />
      {/* Mouth */}
      <g stroke={mood.color}>{mouths[code]}</g>
      {/* Radiant sparkles */}
      {code === 1 && (
        <>
          <circle cx={cx - r * 0.75} cy={cy - r * 0.75} r={r * 0.07} fill={mood.color} opacity={0.6} />
          <circle cx={cx + r * 0.75} cy={cy - r * 0.75} r={r * 0.07} fill={mood.color} opacity={0.6} />
          <circle cx={cx} cy={cy - r * 1.05} r={r * 0.06} fill={mood.color} opacity={0.5} />
        </>
      )}
    </svg>
  );
}

interface EmotionIconSetProps {
  selectedCode?: MoodCode | null;
  onSelect: (code: MoodCode) => void;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: 56, md: 72, lg: 88 };

export default function EmotionIconSet({
  selectedCode,
  onSelect,
  size = "md",
}: EmotionIconSetProps) {
  const iconSize = SIZE_MAP[size];

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-4"
      role="group"
      aria-label="Select your current mood"
    >
      {MOODS.map((mood: MoodDefinition, i) => {
        const isSelected = selectedCode === mood.code;
        return (
          <button
            key={mood.code}
            onClick={() => onSelect(mood.code)}
            aria-label={`${mood.label}: ${mood.description}`}
            aria-pressed={isSelected}
            className="flex flex-col items-center gap-2 transition-all animate-fade-in"
            style={{
              animationDelay: `${i * 80}ms`,
              opacity: 0,
              transform: isSelected ? "scale(1.15)" : "scale(1)",
              minHeight: 48,
              minWidth: 48,
            }}
          >
            <div
              className="rounded-2xl transition-all"
              style={{
                padding: 6,
                backgroundColor: isSelected ? mood.bgColor : "transparent",
                border: isSelected
                  ? `2.5px solid ${mood.borderColor}`
                  : "2.5px solid transparent",
                boxShadow: isSelected
                  ? `0 4px 16px ${mood.color}30`
                  : "none",
              }}
            >
              <MoodFaceSVG code={mood.code} size={iconSize} />
            </div>
            <span
              className="text-xs font-semibold"
              style={{
                color: isSelected ? mood.color : "#8fa0a0",
              }}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
