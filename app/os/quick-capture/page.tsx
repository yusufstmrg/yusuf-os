import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db/server";
import { QuickCaptureForm } from "./quick-capture-form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Quick Capture — Yusuf Personal OS",
  description: "Capture private work, ideas and observations into Yusuf Personal OS.",
  robots: { index: false, follow: false },
};

export default async function QuickCapturePage() {
  if (!auth) redirect("/login?reason=auth_setup");

  const result = await auth.getSession();
  const session = result?.data?.session;
  const user = result?.data?.user;
  if (!session || !user) redirect("/login");

  const db = getDb();
  const captures = db
    ? await db`SELECT id, raw_input, status, processed, created_at FROM public.quick_captures WHERE owner_id=${user.id}::uuid ORDER BY created_at DESC LIMIT 8`.catch(() => [])
    : [];

  return (
    <main className="os-shell">
      <div className="container" style={{ maxWidth: 920 }}>
        <div className="kicker">Execution layer</div>
        <h1 style={{ marginTop: 8 }}>Quick Capture.</h1>
        <p className="section-lead" style={{ marginTop: 14, maxWidth: 720 }}>
          Record work, ideas, decisions, lessons or opportunities in one fast place. Later, the intelligence layer can classify the capture into goals, projects, skills, evidence and next actions.
        </p>
        <div className="card" style={{ marginTop: 34 }}>
          <QuickCaptureForm />
        </div>
        <section style={{ marginTop: 42 }} aria-labelledby="recent-captures">
          <div className="kicker">Capture inbox</div>
          <h2 id="recent-captures" style={{ marginTop: 8 }}>Recent notes.</h2>
          {captures.length === 0 ? (
            <p className="section-lead" style={{ marginTop: 12 }}>Your saved captures will appear here for classification into goals, projects, evidence and next actions.</p>
          ) : (
            <div className="capture-list" style={{ display: "grid", gap: 12, marginTop: 18 }}>
              {captures.map((capture) => (
                <article className="card" key={String(capture.id)} style={{ padding: 20 }}>
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{String(capture.raw_input)}</p>
                  <small style={{ display: "block", marginTop: 10, opacity: 0.65 }}>{String(capture.status || "inbox")} · {new Date(String(capture.created_at)).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</small>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
