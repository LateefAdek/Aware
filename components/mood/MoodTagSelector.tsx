"use client";

import { STRESSOR_TAGS } from "@/lib/constants";
import type { StressorTag } from "@/types";

interface MoodTagSelectorProps {
  selected: StressorTag[];
  onToggle: (tag: StressorTag) => void;
}

export default function MoodTagSelector({ selected, onToggle }: MoodTagSelectorProps) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
      <p className="text-sm font-semibold mb-3" style={{ color: "#5a6e6e" }}>
        What's contributing? <span className="font-normal opacity-60">(optional)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {STRESSOR_TAGS.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              aria-pressed={isSelected}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: isSelected ? "#c8d9c7" : "#fbf8f3",
                color: isSelected ? "#2d5a2c" : "#5a6e6e",
                border: isSelected ? "1.5px solid #a0b89f" : "1.5px solid #d3d3d3",
                minHeight: 48,
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
