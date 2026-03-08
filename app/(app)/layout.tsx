"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import GlobalNav from "@/components/layout/GlobalNav";
import PersistentSOSButton from "@/components/layout/PersistentSOSButton";

const navItems = [
  { href: "/dashboard", label: "Home",     icon: "🏠" },
  { href: "/mood-log",  label: "Log Mood", icon: "🙂" },
  { href: "/history",   label: "Trends",   icon: "📈" },
  { href: "/favorites", label: "Saved",    icon: "🔖" },
  { href: "/settings",  label: "Settings", icon: "⚙️" },
];

// Gradient constants — used throughout
const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";
const GRADIENT_SUBTLE = "linear-gradient(135deg, rgba(199,184,234,0.18) 0%, rgba(95,168,211,0.18) 100%)";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fbf8f3" }}>

      {/* SOS button — always visible */}
      <PersistentSOSButton
        campusPhone="1-800-123-4567"
        campusName="Campus Counseling Center"
      />

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <header
        className="hidden md:flex"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: "60px",
          // Frosted glass top bar
          backgroundColor: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(199,184,234,0.3)",
          alignItems: "center",
          padding: "0 24px",
          zIndex: 40,
          gap: "16px",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          aria-label="Toggle navigation"
          style={{
            width: "40px", height: "40px",
            borderRadius: "10px", border: "none",
            background: sidebarOpen ? GRADIENT_SUBTLE : "#f0ece5",
            cursor: "pointer",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "5px", flexShrink: 0,
            minHeight: "40px", minWidth: "40px",
            transition: "background 0.2s",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: "block", width: "18px", height: "2px",
              background: sidebarOpen ? "#7b5ea7" : "#2d3a3a",
              borderRadius: "2px",
              transition: "all 0.25s ease",
              transform: sidebarOpen
                ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                : "none"
                : "none",
              opacity: sidebarOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>

        {/* Logo */}
        <img
          src="/aware_logo.png"
          alt="Aware Logo"
          style={{ height: "34px", width: "auto" }}
        />

        {/* Gradient accent line at bottom of header */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "2px",
          background: GRADIENT,
          opacity: 0.5,
        }} />
      </header>

      {/* ── OVERLAY ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="hidden md:block"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 30,
            backgroundColor: "rgba(45,58,58,0.25)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ── SIDEBAR — glassmorphism with gradient accent ─────────── */}
      <aside
        className="hidden md:flex"
        style={{
          position: "fixed",
          top: "60px", left: 0,
          width: "240px",
          height: "calc(100vh - 60px)",
          // Frosted glass effect
          backgroundColor: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(199,184,234,0.35)",
          padding: "24px 14px",
          flexDirection: "column",
          zIndex: 35,
          overflowY: "auto",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: sidebarOpen
            ? "6px 0 32px rgba(199,184,234,0.18)"
            : "none",
        }}
      >
        {/* Gradient background blob — subtle accent */}
        <div style={{
          position: "absolute",
          top: "-40px", right: "-40px",
          width: "200px", height: "200px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(199,184,234,0.25) 0%, rgba(95,168,211,0.25) 100%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }} />

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  // Active state uses gradient background
                  background: isActive ? GRADIENT : "transparent",
                  color: isActive ? "#ffffff" : "#5a6e6e",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(95,168,211,0.3)"
                    : "none",
                  transition: "all 0.18s ease",
                  minHeight: "48px",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = GRADIENT_SUBTLE;
                    e.currentTarget.style.color = "#7b5ea7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#5a6e6e";
                  }
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main
        style={{
          width: "100%",
          paddingTop: "84px",
          paddingBottom: "96px",
          paddingLeft: "24px",
          paddingRight: "24px",
          boxSizing: "border-box",
          maxWidth: "800px",
          margin: "0 auto",
        }}
        className="md:pt-20 md:px-10 md:pb-10"
      >
        {children}
      </main>

      {/* ── BOTTOM NAV — mobile only ─────────────────────────────── */}
      <div className="md:hidden">
        <GlobalNav />
      </div>
    </div>
  );
}