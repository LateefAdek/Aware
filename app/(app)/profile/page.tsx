"use client";

import React, { useState, useEffect } from "react";

const GRADIENT = "linear-gradient(135deg, #C7B8EA 0%, #5FA8D3 100%)";

const cardStyle: React.CSSProperties = {
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  border: "1.5px solid #e0dbd3",
  boxShadow: "0 2px 16px rgba(45,58,58,0.06)",
  overflow: "hidden",
};

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

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
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
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          padding: "12px 14px",
          borderRadius: "12px",
          backgroundColor: disabled ? "#f5f5f5" : "#f9f9f9",
          border: "1px solid #e0e0e0",
          fontSize: "14px",
          color: disabled ? "#8fa0a0" : "#1e293b",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "#C7B8EA";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(199,184,234,0.2)";
            e.currentTarget.style.backgroundColor = "#ffffff";
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "#e0e0e0";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.backgroundColor = "#f9f9f9";
          }
        }}
      />
    </div>
  );
}

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: GRADIENT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.35,
      fontWeight: 700,
      color: "#ffffff",
      letterSpacing: "0.02em",
      boxShadow: "0 4px 20px rgba(95,168,211,0.35)",
      flexShrink: 0,
      userSelect: "none",
    }}>
      {initials || "👤"}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
      padding: "12px 20px",
      borderRadius: "16px",
      backgroundColor: "#f9f9f9",
      border: "1.5px solid #e0dbd3",
      minWidth: "80px",
    }}>
      <span style={{
        fontSize: "20px",
        fontWeight: 700,
        color: "transparent",
        background: GRADIENT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        lineHeight: 1.2,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: "11px",
        fontWeight: 600,
        color: "#8fa0a0",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
  );
}

const UNIVERSITIES = [
  "Select your university",
  "University of Lagos",
  "University of Ibadan",
  "Obafemi Awolowo University",
  "University of Benin",
  "University of Abuja",
  "Lagos State University",
  "Other",
];

const YEAR_OPTIONS = [
  "Select year",
  "Foundation / Year 0",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Postgraduate",
];

const STORAGE_KEY = "aware_profile";

interface ProfileData {
  firstName: string;
  lastName: string;
  university: string;
  year: string;
  bio: string;
}

// Load profile from localStorage
function loadProfile(): ProfileData {
  if (typeof window === "undefined") return {
    firstName: "",
    lastName: "",
    university: "Select your university",
    year: "Select year",
    bio: "",
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProfileData;
  } catch {
    // ignore
  }
  return {
    firstName: "",
    lastName: "",
    university: "Select your university",
    year: "Select year",
    bio: "",
  };
}

// Save profile to localStorage
function saveProfile(data: ProfileData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export default function ProfilePage() {
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [university, setUniversity] = useState("Select your university");
  const [year, setYear]             = useState("Select year");
  const [bio, setBio]               = useState("");
  const [saved, setSaved]           = useState(false);
  const [editMode, setEditMode]     = useState(false);
  const [loaded, setLoaded]         = useState(false);

  // Load saved profile on first render
  useEffect(() => {
    const profile = loadProfile();
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setUniversity(profile.university);
    setYear(profile.year);
    setBio(profile.bio);
    // If no name saved yet, open in edit mode automatically
    setEditMode(!profile.firstName);
    setLoaded(true);
  }, []);

  const fullName    = `${firstName} ${lastName}`.trim();
  const hasProfile  = !!(firstName || lastName);

  const handleSave = () => {
    const data: ProfileData = { firstName, lastName, university, year, bio };
    saveProfile(data);
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    // Restore from storage so unsaved edits are discarded
    const profile = loadProfile();
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setUniversity(profile.university);
    setYear(profile.year);
    setBio(profile.bio);
    setEditMode(false);
  };

  // Don't render until localStorage is loaded to avoid flicker
  if (!loaded) return null;

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
          Profile
        </h1>
        <div style={{
          height: "3px",
          borderRadius: "999px",
          background: GRADIENT,
          width: "48px",
        }} />
      </div>

      {/* ── HERO CARD ────────────────────────────────────────────── */}
      <div style={{
        ...cardStyle,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        textAlign: "center",
        background: "linear-gradient(160deg, rgba(199,184,234,0.07) 0%, rgba(95,168,211,0.07) 100%)",
      }}>
        <div style={{ position: "relative" }}>
          <Avatar name={fullName} size={88} />
          <button
            onClick={() => setEditMode(true)}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: GRADIENT,
              border: "2px solid #ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              boxShadow: "0 2px 8px rgba(95,168,211,0.3)",
            }}
            title="Edit profile"
          >
            ✏️
          </button>
        </div>

        <div>
          <h2 style={{
            fontSize: "22px",
            fontWeight: 700,
            color: hasProfile ? "#1e293b" : "#b0bcbc",
            letterSpacing: "-0.01em",
            marginBottom: "4px",
          }}>
            {hasProfile ? fullName : "Your name here"}
          </h2>
          <p style={{ fontSize: "14px", color: "#8fa0a0", fontWeight: 500 }}>
            {year !== "Select year" ? year : ""}
            {university !== "Select your university" ? ` · ${university}` : ""}
            {!hasProfile && "Complete your profile below"}
          </p>
          {bio && (
            <p style={{
              fontSize: "13px",
              color: "#5a6e6e",
              marginTop: "10px",
              lineHeight: 1.6,
              maxWidth: "320px",
              fontStyle: "italic",
            }}>
              &ldquo;{bio}&rdquo;
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <StatPill label="Logs"   value="0" />
          <StatPill label="Streak" value="0" />
          <StatPill label="Saved"  value="0" />
        </div>

        <p style={{ fontSize: "11px", color: "#b0bcbc", fontStyle: "italic" }}>
          Member since March 2026
        </p>
      </div>

      {/* ── PERSONAL INFO ────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="PERSONAL INFO"
          description="How you appear across the app."
        />
        <div style={{ ...cardStyle, padding: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <InputField
                  label="FIRST NAME"
                  value={firstName}
                  onChange={editMode ? setFirstName : undefined}
                  placeholder="First name"
                  disabled={!editMode}
                />
              </div>
              <div style={{ flex: 1 }}>
                <InputField
                  label="LAST NAME"
                  value={lastName}
                  onChange={editMode ? setLastName : undefined}
                  placeholder="Last name"
                  disabled={!editMode}
                />
              </div>
            </div>

            <InputField
              label="EMAIL"
              value=""
              placeholder="Linked to your account"
              disabled
            />
            <p style={{ fontSize: "11px", color: "#b0bcbc", marginTop: "-8px" }}>
              Email is managed through your account and cannot be changed here.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#5a6e6e",
                letterSpacing: "0.04em",
              }}>
                BIO (OPTIONAL)
              </label>
              <textarea
                value={bio}
                onChange={(e) => editMode && setBio(e.target.value)}
                placeholder="A short note about yourself…"
                disabled={!editMode}
                rows={3}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: editMode ? "#f9f9f9" : "#f5f5f5",
                  border: "1px solid #e0e0e0",
                  fontSize: "14px",
                  color: "#1e293b",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                  cursor: editMode ? "text" : "not-allowed",
                  transition: "border-color 0.15s ease",
                }}
                onFocus={(e) => {
                  if (editMode) e.currentTarget.style.borderColor = "#C7B8EA";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              />
            </div>

          </div>

          {/* Edit / Save buttons */}
          <div style={{ marginTop: "20px" }}>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1.5px solid #e0dbd3",
                  background: "transparent",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#5a6e6e",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C7B8EA";
                  e.currentTarget.style.color = "#7b5ea7";
                  e.currentTarget.style.backgroundColor = "rgba(199,184,234,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0dbd3";
                  e.currentTarget.style.color = "#5a6e6e";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Edit profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                {hasProfile && (
                  <button
                    onClick={handleCancel}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1.5px solid #e0dbd3",
                      background: "transparent",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#8fa0a0",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!firstName.trim()}
                  style={{
                    flex: 2,
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: !firstName.trim()
                      ? "#e0dbd3"
                      : saved
                      ? "linear-gradient(135deg, #a0b89f 0%, #5a9e57 100%)"
                      : GRADIENT,
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ffffff",
                    cursor: !firstName.trim() ? "not-allowed" : "pointer",
                    boxShadow: firstName.trim() ? "0 4px 16px rgba(95,168,211,0.3)" : "none",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.01em",
                  }}
                >
                  {saved ? "✓ Saved" : "Save profile"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ACADEMIC INFO ────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="ACADEMIC INFO"
          description="Helps Aware surface content relevant to your stage of study."
        />
        <div style={{ ...cardStyle, padding: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#5a6e6e",
                letterSpacing: "0.04em",
              }}>
                UNIVERSITY
              </label>
              <select
                value={university}
                onChange={(e) => {
                  setUniversity(e.target.value);
                  const current = loadProfile();
                  saveProfile({ ...current, university: e.target.value });
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  fontSize: "14px",
                  color: "#1e293b",
                  outline: "none",
                  width: "100%",
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238fa0a0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: "36px",
                }}
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#5a6e6e",
                letterSpacing: "0.04em",
              }}>
                YEAR OF STUDY
              </label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  const current = loadProfile();
                  saveProfile({ ...current, year: e.target.value });
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  fontSize: "14px",
                  color: "#1e293b",
                  outline: "none",
                  width: "100%",
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238fa0a0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: "36px",
                }}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ── WELLBEING SNAPSHOT ───────────────────────────────────── */}
      <section>
        <SectionHeader
          title="WELLBEING SNAPSHOT"
          description="A summary of your journey so far."
        />
        <div style={{
          ...cardStyle,
          overflow: "visible",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
          backgroundColor: "#e0dbd3",
        }}>
          {[
            { label: "Total check-ins",  value: "0", icon: "📋" },
            { label: "Current streak",   value: "0", icon: "🔥" },
            { label: "Most logged mood", value: "—", icon: "🌿" },
            { label: "Top stressor",     value: "—", icon: "📚" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                borderRadius: i === 0 ? "20px 0 0 0"
                  : i === 1 ? "0 20px 0 0"
                  : i === 2 ? "0 0 0 20px"
                  : "0 0 20px 0",
              }}
            >
              <span style={{ fontSize: "22px" }}>{stat.icon}</span>
              <span style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "transparent",
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "12px", color: "#8fa0a0", fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}