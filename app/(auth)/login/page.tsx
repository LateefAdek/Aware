"use client";

import { useState } from "react";
import Link from "next/link";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [hovered, setHovered]   = useState(false);
  const [pressed, setPressed]   = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  const btnTransform = pressed
    ? "scale(0.98)"
    : hovered && !loading
    ? "translateY(-1px)"
    : "translateY(0)";

  const btnShadow = hovered && !loading
    ? "0 8px 24px rgba(95,168,211,0.45)"
    : "0 4px 18px rgba(95,168,211,0.35)";

  return (
    <div style={{ width: "100%", maxWidth: "420px", margin: "0 auto" }}>

      {/* ── CARD ─────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)",
        padding: "40px 36px",
      }}>

        {/* ── HEADER ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "-0.02em",
            marginBottom: "4px",
          }}>
            Welcome back
          </h1>
          <p style={{
            fontSize: "14px",
            color: "#8fa0a0",
            fontWeight: 400,
            lineHeight: 1.5,
          }}>
            Check in with yourself today.
          </p>
        </div>

        {/* ── ERROR BANNER ─────────────────────────────────────────── */}
        {error && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "12px",
            backgroundColor: "#fff0f0",
            border: "1px solid #fca5a5",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#c0392b",
            fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* ── FIELDS ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#5a6e6e",
              letterSpacing: "0.04em",
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.edu"
              autoComplete="email"
              style={{
                padding: "13px 16px",
                borderRadius: "12px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                color: "#1e293b",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#C7B8EA";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(199,184,234,0.2)";
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.backgroundColor = "#f9f9f9";
              }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <label style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#5a6e6e",
                letterSpacing: "0.04em",
              }}>
                PASSWORD
              </label>
              <Link
                href="#"
                style={{ fontSize: "12px", fontWeight: 600, color: "#6e8b9d", textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                padding: "13px 16px",
                borderRadius: "12px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                color: "#1e293b",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#C7B8EA";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(199,184,234,0.2)";
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.backgroundColor = "#f9f9f9";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>
        </div>

        {/* ── SIGN IN BUTTON ───────────────────────────────────────── */}
        <button
          onClick={handleLogin}
          disabled={loading}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setPressed(false); }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "12px",
            border: "none",
            background: loading ? "#d1d5db" : GRADIENT,
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : btnShadow,
            transform: loading ? "none" : btnTransform,
            transition: "box-shadow 0.2s ease, transform 0.15s ease, background 0.2s ease",
            marginBottom: "28px",
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}>
          <p style={{ fontSize: "14px", color: "#5a6e6e", fontWeight: 400 }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              style={{
                fontWeight: 700,
                color: "transparent",
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >
              Create one
            </Link>
          </p>
          <p style={{
            fontSize: "11px",
            color: "#b0bcbc",
            textAlign: "center",
            lineHeight: 1.6,
            fontStyle: "italic",
            maxWidth: "300px",
          }}>
            Your data is private, encrypted, and never shared.
          </p>
        </div>

      </div>
    </div>
  );
}