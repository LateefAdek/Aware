"use client";

import { useState } from "react";
import { NATIONAL_CRISIS_RESOURCES } from "@/lib/constants";
import type { EmergencyContact } from "@/types";

interface SOSButtonProps {
  personalContact?: EmergencyContact;
  campusPhone?: string;
  campusName?: string;
}

export default function PersistentSOSButton({
  personalContact,
  campusPhone,
  campusName = "Campus Counseling Center",
}: SOSButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* SOS Trigger Button — fixed top-right, always visible */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Emergency Crisis Resources"
        title="Emergency Support"
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
        style={{
          backgroundColor: "#d93025",
          boxShadow: "0 3px 14px rgba(217, 48, 37, 0.4)",
          minHeight: 48,
          minWidth: 48,
        }}
      >
        <span className="text-base leading-none">⚡</span>
        <span className="hidden sm:inline">SOS</span>
      </button>

      {/* Crisis Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: "rgba(45, 58, 58, 0.65)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-7 animate-slide-up"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 -4px 48px rgba(45, 58, 58, 0.18)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 text-2xl"
                style={{ backgroundColor: "#fce8e6" }}
              >
                🆘
              </div>
              <h2
                className="text-xl font-bold"
                style={{ color: "#2d3a3a", letterSpacing: "-0.02em" }}
              >
                You are not alone
              </h2>
              <p className="mt-1 text-sm" style={{ color: "#5a6e6e" }}>
                Reach out — help is available right now
              </p>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              {/* National Hotline — primary, largest */}
              <a
                href={`tel:${NATIONAL_CRISIS_RESOURCES[0].contact_value}`}
                className="flex items-center justify-between w-full px-5 py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: "#d93025",
                  minHeight: 64,
                  textDecoration: "none",
                }}
              >
                <div>
                  <div className="text-base">{NATIONAL_CRISIS_RESOURCES[0].contact_name}</div>
                  <div className="text-sm opacity-90 font-medium">
                    Call {NATIONAL_CRISIS_RESOURCES[0].contact_value}
                  </div>
                </div>
                <span className="text-2xl">📞</span>
              </a>

              {/* Crisis Text Line */}
              <a
                href={`sms:${NATIONAL_CRISIS_RESOURCES[1].contact_value}?body=HELLO`}
                className="flex items-center justify-between w-full px-5 py-4 rounded-2xl font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: "#f4edec",
                  color: "#805e5a",
                  border: "1.5px solid #b09896",
                  minHeight: 56,
                  textDecoration: "none",
                }}
              >
                <div>
                  <div className="text-sm font-bold">{NATIONAL_CRISIS_RESOURCES[1].contact_name}</div>
                  <div className="text-xs opacity-80">
                    Text HOME to {NATIONAL_CRISIS_RESOURCES[1].contact_value}
                  </div>
                </div>
                <span className="text-xl">💬</span>
              </a>

              {/* Campus Support */}
              {campusPhone && (
                <a
                  href={`tel:${campusPhone}`}
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: "#eef3f6",
                    color: "#4e6a7a",
                    border: "1.5px solid #a8c0ce",
                    minHeight: 56,
                    textDecoration: "none",
                  }}
                >
                  <div>
                    <div className="text-sm font-bold">{campusName}</div>
                    <div className="text-xs opacity-80">Call {campusPhone}</div>
                  </div>
                  <span className="text-xl">🏫</span>
                </a>
              )}

              {/* Personal Emergency Contact */}
              {personalContact && (
                <a
                  href={`sms:${personalContact.contact_phone}?body=I'm having a hard time right now. Can we talk?`}
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: "#eef5ed",
                    color: "#2d5a2c",
                    border: "1.5px solid #a0b89f",
                    minHeight: 56,
                    textDecoration: "none",
                  }}
                >
                  <div>
                    <div className="text-sm font-bold">{personalContact.contact_name}</div>
                    <div className="text-xs opacity-80">Send a message</div>
                  </div>
                  <span className="text-xl">🤝</span>
                </a>
              )}
            </div>

            {/* SAMHSA */}
            <p className="mt-4 text-center text-xs" style={{ color: "#8fa0a0" }}>
              SAMHSA Helpline: 1-800-662-4357 (free, confidential, 24/7)
            </p>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80 active:scale-[0.98]"
              style={{
                backgroundColor: "#f0ece5",
                color: "#5a6e6e",
                minHeight: 48,
              }}
            >
              I am safe — close this
            </button>
          </div>
        </div>
      )}
    </>
  );
}
