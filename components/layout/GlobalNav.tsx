"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home",    icon: "🏠" },
  { href: "/mood-log",  label: "Log",     icon: "🙂" },
  { href: "/history",   label: "Trends",  icon: "📈" },
  { href: "/favorites", label: "Saved",   icon: "🔖" },
  { href: "/profile",   label: "Profile", icon: "👤" },
  { href: "/settings",  label: "Settings", icon: "⚙️" },
];

export default function GlobalNav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── BOTTOM NAV — mobile ───────────────────────────────────── */}
      <nav style={{
        display: "flex",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid #f0ece5",
        zIndex: 50,
        padding: "8px 0 12px",
      }}>
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                textDecoration: "none",
                padding: "4px 0",
              }}
            >
              <span style={{
                fontSize: "20px",
                filter: active ? "none" : "grayscale(40%) opacity(0.6)",
                transition: "filter 0.15s ease",
              }}>
                {icon}
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: active ? 700 : 500,
                color: active ? "#7b5ea7" : "#8fa0a0",
                letterSpacing: "0.02em",
                transition: "color 0.15s ease",
              }}>
                {label}
              </span>
              {/* Active dot indicator */}
              {active && (
                <span style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: GRADIENT,
                  marginTop: "1px",
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── SIDEBAR — desktop ────────────────────────────────────── */}
      <aside style={{
        display: "none",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "220px",
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid #f0ece5",
        flexDirection: "column",
        padding: "32px 16px",
        gap: "4px",
        zIndex: 40,
      }}
        className="desktop-sidebar"
      >
        <div style={{ marginBottom: "32px", paddingLeft: "12px" }}>
          <img
            src="/aware_logo.png"
            alt="Aware"
            style={{ height: "32px", width: "auto" }}
          />
        </div>

        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "12px",
                textDecoration: "none",
                background: active ? GRADIENT : "transparent",
                color: active ? "#ffffff" : "#5a6e6e",
                fontWeight: active ? 700 : 500,
                fontSize: "14px",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "18px" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </aside>
    </>
  );
}