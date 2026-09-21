import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { GoogleSignInButton } from "../auth/google-sign-in-button";

export const metadata = {
  title: "Sign in — Yusuf B. Situmorang",
  description: "Secure gateway to the private Yusuf Personal OS.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string; reason?: string; callbackUrl?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const callbackUrl = params.callbackUrl || params.from || "/os";

  return (
    <main className="section section-white" style={{ minHeight: "100svh", display: "grid", placeItems: "center" }}>
      <div className="container" style={{ maxWidth: 920 }}>
        <Link className="btn btn-dark" href="/" style={{ display: "inline-flex", marginBottom: 36 }}>
          <ArrowLeft size={15} /> Back to Yusuf
        </Link>

        {params.reason === "database_error" && (
          <div style={{ padding: "16px", marginBottom: "24px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "12px", color: "#ef4444" }}>
            <h4 style={{ margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={18} /> Database Connection Failed
            </h4>
            <p style={{ margin: 0, fontSize: "14px" }}>
              Sistem berhasil mengautentikasi Anda, tetapi koneksi ke <strong>PostgreSQL Database</strong> gagal. <br/>
              Pastikan Anda telah mengatur Environment Variables (<code>SQL_HOST</code>, dll.) dengan benar di Vercel.
            </p>
          </div>
        )}

        <div className="kicker">Yusuf Platform</div>
        <h1 style={{ marginTop: 10, maxWidth: 780 }}>One identity. Two worlds. Private by default.</h1>
        <p className="section-lead" style={{ maxWidth: 700, marginTop: 18 }}>
          The public profile and private Personal OS share a controlled identity layer. Sensitive life, financial, career and planning data stays inside the private workspace.
        </p>

        <div className="grid-2" style={{ marginTop: 42 }}>
          <div className="card">
            <LockKeyhole size={20} />
            <h3>Private Personal OS</h3>
            <p>Command Center, life strategy, goals, sprint, quick capture, skills, career, proof, brand, network, business, wealth, purpose and reviews.</p>
            <div style={{ marginTop: 20 }}>
              <GoogleSignInButton redirectUrl={callbackUrl} />
            </div>
          </div>
          <div className="card">
            <ShieldCheck size={20} />
            <h3>Security boundary</h3>
            <p>Private records are owner-scoped and intended to be exposed only through authenticated application paths and explicit publication workflows.</p>
          </div>
        </div>

        <div className="notice" style={{ marginTop: 28, padding: 20, border: "1px solid rgba(17,37,54,.14)", borderRadius: 18, background: "#f6f8fa" }}>
          <strong>Firebase Auth is now the authentication foundation.</strong>
          <p style={{ margin: "8px 0 0" }}>
            Private access is protected by Firebase Google Sign-In. The public website remains available without login.
          </p>
        </div>
      </div>
    </main>
  );
}
