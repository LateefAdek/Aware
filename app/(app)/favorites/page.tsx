"use client";

import { useState } from "react";
import DailyResourceCard from "@/components/daily-spark/DailyResourceCard";
import { SEED_RESOURCES } from "@/lib/constants";
import type { DailySparkResource } from "@/types";

// Demo: first two resources are pre-favorited
const DEMO_FAVORITES: number[] = [1, 4];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>(DEMO_FAVORITES);

  const favoriteResources: DailySparkResource[] = SEED_RESOURCES.filter((r) =>
    favorites.includes(r.resource_id)
  ).map((r) => ({ ...r, is_burnout_override: false }));

  const handleFavorite = (resourceId: number) => {
    setFavorites((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-2 animate-fade-in">
        <h1
          className="text-2xl font-bold"
          style={{ color: "#2d3a3a", letterSpacing: "-0.02em" }}
        >
          Saved resources
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#8fa0a0" }}>
          Your personal toolkit — revisit anytime
        </p>
      </div>

      {favoriteResources.length === 0 ? (
        <div
          className="text-center py-16 px-6 animate-fade-in"
          style={{
            backgroundColor: "#f0ece5",
            borderRadius: 20,
            border: "1.5px dashed #d3d3d3",
          }}
        >
          <div className="text-5xl mb-4">🌿</div>
          <p className="font-bold text-base mb-2" style={{ color: "#2d3a3a" }}>
            Nothing saved yet
          </p>
          <p className="text-sm" style={{ color: "#8fa0a0", lineHeight: 1.7 }}>
            Tap the bookmark icon on any Daily Spark to save it here for whenever you need it.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteResources.map((resource, i) => (
            <div
              key={resource.resource_id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
            >
              <DailyResourceCard
                resource={resource}
                isFavorited={true}
                onFavorite={handleFavorite}
              />
            </div>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <p className="text-center text-xs" style={{ color: "#8fa0a0" }}>
          {favorites.length} saved resource{favorites.length !== 1 ? "s" : ""}. Tap the bookmark to unsave.
        </p>
      )}
    </div>
  );
}
