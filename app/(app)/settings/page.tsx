"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#8fa0a0",
        marginBottom: description ? "4px" : "0",
      }}>
        {title}
      </h2>
      {description && (
        <p style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "#5a6e6e",
          maxWidth: "480px",
          lineHeight: 1.6,
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  border: "1.5px solid #e0dbd3",
  boxShadow: "0 2px 16px rgba(45,58,58,0.06)",
  overflow: "hidden",
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: "52px",
        height: "30px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        padding: "3px",
        background: checked ? GRADIENT : "#d1d5db",
        position: "relative",
        transition: "background 0.25s ease-in-out",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{
        display: "block",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.12)",
        transform: checked ? "translateX(22px)" : "translateX(0px)",
        transition: "transform 0.25s ease-in-out",
        flexShrink: 0,
      }} />
    </button>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  isLast = false,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      padding: "16px 20px",
      borderBottom: isLast ? "none" : "1px solid #f5f2ef",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#1e293b",
          marginBottom: description ? "2px" : 0,
        }}>
          {label}
        </p>
        {description && (
          <p style={{
            fontSize: "12px",
            color: "#8fa0a0",
            lineHeight: 1.5,
            maxWidth: "360px",
          }}>
            {description}
          </p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontSize: "12px",
        fontWeight: 700,
        color: "#5a6e6e",
        letterSpacing: "0.04em",
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: "12px 14px",
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
          border: "1.5px solid #cbd5e1",
          fontSize: "14px",
          color: "#1e293b",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#C7B8EA";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(199,184,234,0.2)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#cbd5e1";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  const [highContrast, setHighContrast]   = useState(false);
  const [reduceMotion, setReduceMotion]   = useState(false);
  const [mfaEnabled, setMfaEnabled]       = useState(false);
  const [contactName, setContactName]     = useState("");
  const [contactPhone, setContactPhone]   = useState("");
  const [contactSaved, setContactSaved]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [exportDone, setExportDone]       = useState(false);

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  };

  const handleExport = () => {
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  const handleLogout = () => {
    // In production this calls supabase.auth.signOut()
    router.push("/login");
  };

  const isContactValid = contactName.trim() && contactPhone.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────── */}
      <div style={{ paddingTop: "8px" }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#1e293b",
          letterSpacing: "-0.02em",
          marginBottom: "6px",
        }}>
          Settings
        </h1>
        <div style={{
          height: "3px",
          borderRadius: "999px",
          background: GRADIENT,
          width: "48px",
        }} />
      </div>

      {/* ── ACCESSIBILITY ────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="ACCESSIBILITY"
          description="Adjust the display to suit your visual preferences."
        />
        <div style={cardStyle}>
          <ToggleRow
            label="High-contrast mode"
            description="Increases text contrast for easier reading."
            checked={highContrast}
            onChange={setHighContrast}
          />
          <ToggleRow
            label="Reduce motion"
            description="Disables animations throughout the app."
            checked={reduceMotion}
            onChange={setReduceMotion}
            isLast
          />
        </div>
      </section>

      {/* ── EMERGENCY CONTACT ────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="EMERGENCY CONTACT"
          description="Add a trusted person to your SOS screen. They will be offered as a quick-message option during a crisis. This information stays on your device only."
        />
        <div style={{ ...cardStyle, padding: "20px" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "18px",
          }}>
            <InputField
              label="CONTACT NAME"
              value={contactName}
              onChange={setContactName}
              placeholder="e.g. Mum, Best Friend, Counsellor"
            />
            <InputField
              label="PHONE NUMBER"
              value={contactPhone}
              onChange={setContactPhone}
              placeholder="+1 (000) 000-0000"
              type="tel"
            />
          </div>

          <button
            onClick={handleSaveContact}
            disabled={!isContactValid}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background: !isContactValid
                ? "#e0dbd3"
                : contactSaved
                ? "linear-gradient(135deg, #a0b89f 0%, #5a9e57 100%)"
                : GRADIENT,
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: !isContactValid ? "not-allowed" : "pointer",
              minHeight: "52px",
              boxShadow: !isContactValid ? "none" : "0 4px 16px rgba(95,168,211,0.3)",
              transition: "all 0.2s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              if (isContactValid) {
                e.currentTarget.style.filter = "brightness(1.07)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {contactSaved ? "✓ Contact saved" : "Save contact"}
          </button>
        </div>
      </section>

      {/* ── SECURITY ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="SECURITY"
          description="Manage authentication and account security options."
        />
        <div style={cardStyle}>
          <ToggleRow
            label="Two-factor authentication"
            description="Adds an extra layer of sign-in security via your email."
            checked={mfaEnabled}
            onChange={setMfaEnabled}
          />
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f5f2ef" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <p style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "2px",
                }}>
                  Change password
                </p>
                <p style={{ fontSize: "12px", color: "#8fa0a0" }}>
                  Last changed: never
                </p>
              </div>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: "1.5px solid #cbd5e1",
                  background: "transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#5a6e6e",
                  cursor: "pointer",
                  minHeight: "36px",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C7B8EA";
                  e.currentTarget.style.color = "#7b5ea7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#5a6e6e";
                }}
              >
                Update
              </button>
            </div>
          </div>

          {/* ── SIGN OUT ROW ─────────────────────────────────────── */}
          <div style={{
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}>
            <div>
              <p style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "2px",
              }}>
                Sign out
              </p>
              <p style={{ fontSize: "12px", color: "#8fa0a0" }}>
                You will be returned to the login screen.
              </p>
            </div>

            {!logoutConfirm ? (
              <button
                onClick={() => setLogoutConfirm(true)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  border: "1.5px solid #cbd5e1",
                  background: "transparent",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#5a6e6e",
                  cursor: "pointer",
                  minHeight: "38px",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C7B8EA";
                  e.currentTarget.style.color = "#7b5ea7";
                  e.currentTarget.style.backgroundColor = "rgba(199,184,234,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#5a6e6e";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Sign out
              </button>
            ) : (
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button
                  onClick={() => setLogoutConfirm(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #e0dbd3",
                    background: "transparent",
                    color: "#8fa0a0",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: "38px",
                    transition: "all 0.15s",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: GRADIENT,
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: "38px",
                    boxShadow: "0 2px 10px rgba(95,168,211,0.3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Yes, sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PRIVACY & DATA ───────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="PRIVACY & DATA"
          description="You own your data. Export or delete it at any time — no questions asked."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Export */}
          <div style={{
            ...cardStyle,
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}>
            <div>
              <p style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "3px",
              }}>
                Export my data
              </p>
              <p style={{ fontSize: "12px", color: "#8fa0a0", lineHeight: 1.5 }}>
                Download a copy of all your mood logs and settings as a JSON file.
              </p>
            </div>
            <button
              onClick={handleExport}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: "none",
                background: exportDone
                  ? "linear-gradient(135deg, #a0b89f 0%, #5a9e57 100%)"
                  : GRADIENT,
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                minHeight: "42px",
                flexShrink: 0,
                boxShadow: "0 2px 10px rgba(95,168,211,0.25)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.07)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {exportDone ? "✓ Exported" : "Export"}
            </button>
          </div>

          {/* Delete — red tint, destructive */}
          <div style={{
            ...cardStyle,
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            border: "1.5px solid #fca5a5",
            backgroundColor: "#fff8f8",
          }}>
            <div>
              <p style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#c0392b",
                marginBottom: "3px",
              }}>
                Delete my account
              </p>
              <p style={{ fontSize: "12px", color: "#9e6e6e", lineHeight: 1.5 }}>
                Permanently deletes all your data. This cannot be undone.
              </p>
            </div>

            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  border: "1.5px solid #fca5a5",
                  background: "transparent",
                  color: "#c0392b",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  minHeight: "42px",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fce8e6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Delete
              </button>
            ) : (
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #e0dbd3",
                    background: "transparent",
                    color: "#8fa0a0",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: "38px",
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#d93025",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: "38px",
                    boxShadow: "0 2px 8px rgba(217,48,37,0.3)",
                  }}
                >
                  Confirm delete
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        paddingTop: "48px",
        paddingBottom: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        borderTop: "1px solid #f0ece5",
      }}>
        <img
          src="/aware_logo.png"
          alt="Aware"
          style={{ height: "28px", width: "auto", opacity: 0.6 }}
        />
        <p style={{ fontSize: "12px", color: "#8fa0a0", fontWeight: 500 }}>
          Aware v1.0.0
        </p>
        <p style={{
          fontSize: "11px",
          color: "#b0bcbc",
          textAlign: "center",
          lineHeight: 1.6,
          maxWidth: "280px",
        }}>
          Built with care for student wellbeing.
        </p>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a
            href="#"
            style={{ fontSize: "11px", color: "#6e8b9d", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
          >
            Privacy Policy
          </a>
          <span style={{ fontSize: "11px", color: "#b0bcbc" }}>·</span>
          <a
            href="#"
            style={{ fontSize: "11px", color: "#6e8b9d", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
          >
            Terms of Service
          </a>
        </div>
      </footer>

    </div>
  );
}