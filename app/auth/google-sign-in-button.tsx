"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { googleSignIn, initAuth } from "@/lib/firebase";
import { AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";

export function GoogleSignInButton({ redirectUrl = "/os" }: { redirectUrl?: string }) {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setNeedsAuth(false);
        router.push(redirectUrl);
      },
      () => {
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, [router, redirectUrl]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err?.code === "auth/unauthorized-domain" || err?.message?.includes("unauthorized-domain")) {
        setAuthError("unauthorized-domain");
      } else if (err?.code === "auth/popup-closed-by-user") {
        setAuthError("Proses login dibatalkan karena popup ditutup sebelum selesai. Silakan coba lagi.");
      } else {
        setAuthError(err?.message || "Gagal masuk dengan Google");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };



  const [ownerPin, setOwnerPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerPin.trim()) return;
    setPinLoading(true);
    setPinError(null);
    try {
      const res = await fetch("/api/auth/owner-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: ownerPin.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "PIN Keamanan tidak valid.");
      }
      setNeedsAuth(false);
      window.location.href = redirectUrl;
    } catch (err: any) {
      setPinError(err?.message || "Gagal verifikasi PIN");
    } finally {
      setPinLoading(false);
    }
  };

  if (!needsAuth && !isLoggingIn) {
    return <p style={{ color: "#34A853", fontWeight: 600 }}>Terautentikasi. Mengalihkan ke Command Center...</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "480px", width: "100%" }}>
      {/* Option 1: Google Workspace Authentication */}
      <div>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn || pinLoading}
          className="gsi-material-button"
          style={{
            backgroundColor: "#fff",
            color: "#3c4043",
            border: "1px solid #dadce0",
            borderRadius: "10px",
            padding: "0 16px",
            height: "46px",
            width: "100%",
            cursor: isLoggingIn ? "wait" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontFamily: "'Google Sans', roboto, sans-serif",
            fontSize: "14px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            transition: "all .2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            {isLoggingIn ? "Menghubungkan ke Google..." : "Sign in with Google Workspace"}
          </div>
        </button>

        {authError === "unauthorized-domain" && (
          <div style={{
            marginTop: "12px",
            padding: "14px",
            background: "rgba(234,179,8,0.12)",
            border: "1px solid rgba(234,179,8,0.35)",
            borderRadius: "10px",
            fontSize: "13px",
            color: "var(--ink)",
            lineHeight: 1.5
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#eab308", marginBottom: "6px" }}>
              <AlertCircle size={16} /> Domain Belum Diotorisasi di Firebase Console
            </div>
            <p style={{ margin: "0 0 10px 0" }}>
              Tambahkan domain <b>yusuf-platform.vercel.app</b> di <b>Authorized domains</b> Firebase Authentication. Atau Anda bisa langsung masuk menggunakan <b>PIN Akses Pemilik</b> di bawah.
            </p>
            <a
              href="https://console.firebase.google.com/project/gen-lang-client-0612253028/authentication/settings"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "var(--navy)",
                color: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              Buka Pengaturan Firebase <ArrowRight size={12} />
            </a>
          </div>
        )}

        {authError && authError !== "unauthorized-domain" && (
          <div style={{
            marginTop: "12px",
            padding: "12px 14px",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#ef4444"
          }}>
            {authError}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--muted)", fontSize: "12px" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
        <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>ATAU AKSES LANGSUNG</span>
        <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
      </div>

      {/* Option 2: Owner Security PIN Authentication */}
      <form onSubmit={handlePinLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
            PIN Keamanan Pemilik (Yusuf B. Situmorang)
          </label>
          <span style={{ fontSize: "11px", color: "var(--gold2)", fontWeight: 700 }}>Privat 24/7</span>
        </div>
        
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="password"
            placeholder="Masukkan 6-digit PIN Pemilik..."
            value={ownerPin}
            onChange={(e) => setOwnerPin(e.target.value)}
            disabled={pinLoading}
            style={{
              flex: 1,
              height: "44px",
              padding: "0 14px",
              borderRadius: "10px",
              border: "1px solid var(--line)",
              background: "var(--paper)",
              color: "var(--ink)",
              fontSize: "14px",
              outline: "none",
              letterSpacing: "0.15em",
            }}
          />
          <button
            type="submit"
            disabled={pinLoading || !ownerPin}
            className="btn btn-primary"
            style={{
              padding: "0 18px",
              height: "44px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 800,
              cursor: pinLoading || !ownerPin ? "not-allowed" : "pointer",
              opacity: pinLoading || !ownerPin ? 0.6 : 1,
              whiteSpace: "nowrap"
            }}
          >
            {pinLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
          </button>
        </div>

        {pinError && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#ef4444"
          }}>
            {pinError}
          </div>
        )}
      </form>
    </div>
  );
}
