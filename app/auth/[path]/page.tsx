import { GoogleSignInButton } from "../google-sign-in-button";

export const metadata = {
  title: "Authentication — Yusuf B. Situmorang",
  robots: { index: false, follow: false },
};

export default async function AuthPage() {
  return (
    <main className="auth-shell">
      <div className="auth-panel" style={{ padding: "40px", maxWidth: "480px", margin: "0 auto", marginTop: "100px", textAlign: "center", border: "1px solid #eaeaea", borderRadius: "12px", background: "#fff" }}>
        <div className="kicker" style={{ color: "#666", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Yusuf Platform</div>
        <h1 style={{ fontSize: "28px", marginBottom: "16px", color: "#111" }}>One identity. Two worlds.</h1>
        <p className="section-lead" style={{ color: "#555", fontSize: "16px", lineHeight: "1.5", marginBottom: "32px" }}>
          Secure access to the private Personal OS. Your public profile remains public; your personal workspace stays protected.
        </p>
        <div className="auth-card" style={{ display: "flex", justifyContent: "center" }}>
          <GoogleSignInButton />
        </div>
      </div>
    </main>
  );
}
