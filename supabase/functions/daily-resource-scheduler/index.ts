// Supabase Edge Function: daily-resource-scheduler
// Deploy with: supabase functions deploy daily-resource-scheduler
// Schedule: Set up as a cron job in Supabase Dashboard (e.g., daily at 6 AM)
//
// This function:
// 1. Checks each user's last 3 days of mood logs
// 2. If burnout pattern detected (3+ Drained/Struggling), assigns burnout resource
// 3. Otherwise assigns the scheduled daily rotation resource

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BURNOUT_THRESHOLD = 3;

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const today = new Date().toISOString().split("T")[0];

  // Get all active users
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("is_active", true);

  if (usersError) {
    return new Response(JSON.stringify({ error: usersError.message }), {
      status: 500,
    });
  }

  // Get all active resources
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("is_active", true);

  if (!resources || resources.length === 0) {
    return new Response(JSON.stringify({ error: "No resources available" }), {
      status: 500,
    });
  }

  const burnoutResources = resources.filter(
    (r) => r.resource_type === "BURNOUT_RECOVERY"
  );
  const standardResources = resources.filter(
    (r) => r.resource_type !== "BURNOUT_RECOVERY"
  );

  // Day-of-year rotation index
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (Date.now() - start.getTime()) / 86400000
  );

  const results = { assigned: 0, burnout_overrides: 0, errors: 0 };

  for (const user of users ?? []) {
    try {
      // Check for existing delivery today
      const { data: existing } = await supabase
        .from("daily_resource_history")
        .select("history_id")
        .eq("user_id", user.user_id)
        .eq("delivery_date", today)
        .single();

      if (existing) continue; // Already delivered today

      // Check last 3 days mood trend
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data: recentLogs } = await supabase
        .from("mood_logs")
        .select("mood_icon_code")
        .eq("user_id", user.user_id)
        .gte("log_timestamp", threeDaysAgo.toISOString())
        .order("log_timestamp", { ascending: false })
        .limit(3);

      const isBurnout =
        (recentLogs?.filter((l) => l.mood_icon_code >= 4).length ?? 0) >=
        BURNOUT_THRESHOLD;

      let selectedResource;
      if (isBurnout && burnoutResources.length > 0) {
        selectedResource = burnoutResources[0];
        results.burnout_overrides++;
      } else {
        selectedResource = standardResources[dayOfYear % standardResources.length];
      }

      await supabase.from("daily_resource_history").insert({
        user_id: user.user_id,
        resource_id: selectedResource.resource_id,
        delivery_date: today,
        engagement_type: "VIEWED",
      });

      results.assigned++;
    } catch {
      results.errors++;
    }
  }

  return new Response(JSON.stringify({ success: true, date: today, ...results }), {
    headers: { "Content-Type": "application/json" },
  });
});
