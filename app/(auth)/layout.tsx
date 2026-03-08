export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg, #fbf8f3 0%, #f0ece5 100%)" }}
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center mb-3">
          <img
            src="/aware_logo.png"
            alt="Aware Logo"
            style={{ height: "48px", width: "auto" }}
          />
        </div>
        <p className="text-sm font-medium" style={{ color: "#8fa0a0" }}>
          Support in Seconds
        </p>
      </div>

      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 32px rgba(45, 58, 58, 0.08)",
        }}
      >
        {children}
      </div>

      <p
        className="mt-8 text-xs text-center"
        style={{ color: "#8fa0a0", lineHeight: 1.7 }}
      >
        Your data is private, encrypted, and never shared.
        <br />
        <a href="#" style={{ color: "#6e8b9d" }}>
          Privacy Policy
        </a>
        {" "}&middot;{" "}
        <a href="#" style={{ color: "#6e8b9d" }}>
          Terms of Service
        </a>
      </p>
    </div>
  );
}