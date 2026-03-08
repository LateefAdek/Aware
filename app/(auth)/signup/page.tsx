"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const isFormValid = email.trim() && password.trim().length >= 8 && consent;

  const handleSignup = async () => {
    if (!isFormValid) return;
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push("/dashboard");
  };

  const inputStyle = (): React.CSSProperties => ({
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
  });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#C7B8EA";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(199,184,234,0.2)";
    e.currentTarget.style.backgroundColor = "#ffffff";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#e0e0e0";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.backgroundColor = "#f9f9f9";
  };

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
            Create account
          </h1>
          <p style={{
            fontSize: "14px",
            color: "#8fa0a0",
            fontWeight: 400,
            lineHeight: 1.5,
          }}>
            Your journey to self-awareness starts here.
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

        {/* ── FORM ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

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
              style={inputStyle()}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#5a6e6e",
              letterSpacing: "0.04em",
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              style={inputStyle()}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isFormValid) handleSignup();
              }}
            />
            {/* Live password hint */}
            {password.length > 0 && password.length < 8 && (
              <p style={{
                fontSize: "11px",
                color: "#9e7a6e",
                fontWeight: 500,
                marginTop: "2px",
              }}>
                {8 - password.length} more character{8 - password.length !== 1 ? "s" : ""} needed
              </p>
            )}
            {password.length >= 8 && (
              <p style={{
                fontSize: "11px",
                color: "#5a9e57",
                fontWeight: 500,
                marginTop: "2px",
              }}>
                ✓ Password looks good
              </p>
            )}
          </div>

          {/* ── CONSENT ──────────────────────────────────────────────
              8px top margin separates it from password field
              Checkbox perfectly top-aligned with first line of text  */}
          <div style={{
            marginTop: "8px",
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: consent ? "rgba(199,184,234,0.08)" : "#f9f9f9",
            border: `1.5px solid ${consent ? "rgba(199,184,234,0.4)" : "#e0e0e0"}`,
            transition: "all 0.2s ease",
          }}>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.07em",
              color: "#8fa0a0",
              marginBottom: "10px",
            }}>
              PRIVACY & DATA CONSENT
            </p>

            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}>
              {/* Custom gradient checkbox */}
              <button
                role="checkbox"
                aria-checked={consent}
                onClick={() => setConsent((c) => !c)}
                style={{
                  width: "20px",
                  height: "20px",
                  minWidth: "20px",
                  borderRadius: "6px",
                  border: `2px solid ${consent ? "transparent" : "#cbd5e1"}`,
                  background: consent ? GRADIENT : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "2px",
                  padding: 0,
                  transition: "all 0.18s ease",
                  boxShadow: consent ? "0 2px 8px rgba(95,168,211,0.3)" : "none",
                  flexShrink: 0,
                }}
              >
                {consent && (
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path
                      d="M1 3.5L4 6.5L10 1"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* Consent text — links inline, no separate "View details" row */}
              <div>
                <p style={{
                  fontSize: "13px",
                  color: "#5a6e6e",
                  lineHeight: 1.65,
                  fontWeight: 400,
                }}>
                  I agree to the{" "}
                  <Link
                    href="#"
                    style={{
                      color: "#7b5ea7",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                  >
                    Privacy Policy
                  </Link>
                  {" "}and{" "}
                  <Link
                    href="#"
                    style={{
                      color: "#7b5ea7",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                  >
                    Terms of Service
                  </Link>
                  . My mood data is never shared with my institution.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── CREATE ACCOUNT BUTTON ─────────────────────────────────
            Semi-transparent until form valid, vibrant when ready    */}
        <button
          onClick={handleSignup}
          disabled={!isFormValid || loading}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "12px",
            border: "none",
            background: !isFormValid
              ? "linear-gradient(135deg, rgba(199,184,234,0.4) 0%, rgba(95,168,211,0.4) 100%)"
              : loading
              ? "#d1d5db"
              : GRADIENT,
            color: !isFormValid ? "rgba(255,255,255,0.7)" : "#ffffff",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            cursor: !isFormValid || loading ? "not-allowed" : "pointer",
            boxShadow: isFormValid && !loading
              ? "0 4px 18px rgba(95,168,211,0.35)"
              : "none",
            transition: "all 0.25s ease",
            marginTop: "24px",
            marginBottom: "28px",
          }}
          onMouseEnter={(e) => {
            if (isFormValid && !loading) {
              e.currentTarget.style.filter = "brightness(1.07)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(95,168,211,0.45)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = isFormValid && !loading
              ? "0 4px 18px rgba(95,168,211,0.35)"
              : "none";
          }}
          onMouseDown={(e) => {
            if (isFormValid && !loading) {
              e.currentTarget.style.transform = "scale(0.98)";
            }
          }}
          onMouseUp={(e) => {
            if (isFormValid && !loading) {
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}>
          <p style={{ fontSize: "14px", color: "#5a6e6e", fontWeight: 400 }}>
            Already have an account?{" "}
            <Link
              href="/login"
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
              Sign in here
            </Link>
          </p>

          {/* De-emphasised privacy note */}
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