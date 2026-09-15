"use client";

import { useState } from "react";
import { BrainCircuit, RefreshCw } from "lucide-react";

export function RefreshIntelligenceButton() {
  const [pending, setPending] = useState(false);
  const [briefPending, setBriefPending] = useState(false);
  const [message, setMessage] = useState("");
  const [brief, setBrief] = useState("");

  async function refresh() {
    setPending(true); setMessage("");
    try {
      const response = await fetch("/api/intelligence/refresh", { method: "POST" });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "refresh_failed");
      setMessage(`${body.count} recommendations refreshed.`);
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message.replaceAll("_", " ") : "Unable to refresh intelligence.");
    } finally { setPending(false); }
  }

  async function generateBrief() {
    setBriefPending(true); setMessage("");
    try {
      const response = await fetch("/api/intelligence/brief", { method: "POST" });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "brief_failed");
      setBrief(body.brief);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to generate private brief.");
    } finally { setBriefPending(false); }
  }

  return <div style={{display:"grid",gap:12,justifyItems:"end"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",justifyContent:"end"}}>
      <button className="btn btn-secondary" type="button" onClick={generateBrief} disabled={briefPending}><BrainCircuit size={15}/>{briefPending ? "Thinking…" : "Generate private brief"}</button>
      <button className="btn btn-dark" type="button" onClick={refresh} disabled={pending}><RefreshCw size={15} style={pending?{animation:"spin 1s linear infinite"}:undefined}/>{pending?"Refreshing…":"Refresh intelligence"}</button>
    </div>
    {message && <span style={{fontSize:12,color:"var(--muted)"}}>{message}</span>}
    {brief && <article className="card" style={{maxWidth:520,padding:18,textAlign:"left",whiteSpace:"pre-wrap"}}><div className="kicker">Private Chief of Staff</div><p style={{margin:"10px 0 0",lineHeight:1.65}}>{brief}</p></article>}
    <style jsx>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>;
}
