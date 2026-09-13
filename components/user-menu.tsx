"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, ShieldCheck, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/firebase";

export function UserMenu({ user }: { user: { name?: string | null; email: string } }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
      router.push("/");
    }
  };


  const initials = (user.name || "Y").slice(0, 2).toUpperCase();

  return (
    <div className="user-menu" ref={ref} style={{ position: "relative" }}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        style={{ 
          display: "flex", alignItems: "center", gap: 10, background: "transparent", 
          border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8, transition: "background 0.2s" 
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "var(--surface)"}
        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
          <strong style={{ fontSize: 14, color: "var(--foreground)" }}>{user.name || "Yusuf"}</strong>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{user.email}</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: "var(--foreground)", color: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14 }}>
          {initials}
        </div>
        <MoreVertical size={16} style={{ color: "var(--muted)" }} />
      </button>

      {open && (
        <div style={{ 
          position: "absolute", top: "100%", right: 0, marginTop: 8, width: 220, 
          background: "var(--background)", border: "1px solid var(--line)", borderRadius: 12, 
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)", zIndex: 50, overflow: "hidden", animation: "rise 0.2s ease" 
        }}>
          <div style={{ padding: "16px 16px 8px", borderBottom: "1px solid var(--line)" }}>
            <strong style={{ display: "block", fontSize: 14 }}>{user.name || "Yusuf"}</strong>
            <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{user.email}</span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, background: "var(--surface)", padding: "2px 6px", borderRadius: 10, fontWeight: 500 }}>
              <ShieldCheck size={12} color="var(--success, #10b981)" /> Superadmin
            </div>
          </div>
          <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
            <Link href="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", fontSize: 14, color: "var(--foreground)", textDecoration: "none", borderRadius: 6, transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "var(--surface)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
              <User size={16} /> Public Profile
            </Link>
            <Link href="/os/strategy" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", fontSize: 14, color: "var(--foreground)", textDecoration: "none", borderRadius: 6, transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "var(--surface)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
              <Settings size={16} /> OS Settings
            </Link>
          </div>
          <div style={{ padding: 8, borderTop: "1px solid var(--line)" }}>
            <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", fontSize: 14, color: "var(--destructive, #ef4444)", background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer", borderRadius: 6, transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
