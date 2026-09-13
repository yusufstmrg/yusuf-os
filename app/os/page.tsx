import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, CircleGauge, Coins, Flag, Layers3, ListChecks, Sparkles, Target, UserRoundCheck } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { requirePrivateDb } from "@/lib/os/server";
import { WorkspaceDashboard } from "@/components/workspace-dashboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Personal OS — Yusuf B. Situmorang",
  description: "Private Yusuf Personal OS command center.",
  robots: { index: false, follow: false },
};

const modules = [
  ["Command Center", "Daily priorities, momentum and executive brief", "/os", CircleGauge],
  ["Life Strategy", "North Star, domains and long-term direction", "/os/strategy", Flag],
  ["Goals / OKR", "Objectives, key results and measurable outcomes", "/os/strategy", Target],
  ["90-Day Sprint", "Quarterly execution with visible progress", "/os/sprint", ListChecks],
  ["Skills", "Capability gaps, learning and proof", "/os/skills", Layers3],
  ["Career", "Targets, opportunities and readiness", "/os/career", BriefcaseBusiness],
  ["Business", "BuildUp, Tradevance and commercial pipeline", "/os/business", Sparkles],
  ["Wealth", "Cash flow, assets, net worth and FI trajectory", "/os/wealth", Coins],
  ["Reviews", "Weekly, monthly and quarterly reflection", "/os/reviews", UserRoundCheck],
] as const;

export default async function PersonalOsPage() {
  const { user, db } = await requirePrivateDb();
  const [summary, scores] = await Promise.all([
    db`SELECT
      (SELECT COUNT(*) FROM public.goals WHERE owner_id=${user.id}::uuid) AS goals,
      (SELECT COUNT(*) FROM public.tasks WHERE owner_id=${user.id}::uuid AND status NOT IN ('done','completed')) AS open_tasks,
      (SELECT COUNT(*) FROM public.quick_captures WHERE owner_id=${user.id}::uuid AND processed=false) AS unprocessed_captures,
      (SELECT COUNT(*) FROM public.projects WHERE owner_id=${user.id}::uuid) AS projects,
      (SELECT COUNT(*) FROM public.skills WHERE owner_id=${user.id}::uuid) AS skills,
      (SELECT COUNT(*) FROM public.career_targets WHERE owner_id=${user.id}::uuid) AS career_targets,
      (SELECT COUNT(*) FROM public.deals WHERE owner_id=${user.id}::uuid) AS deals,
      (SELECT COUNT(*) FROM public.next_best_actions WHERE owner_id=${user.id}::uuid AND status NOT IN ('done','completed')) AS next_actions`,
    db`SELECT personal_value FROM public.score_snapshots WHERE owner_id=${user.id}::uuid ORDER BY snapshot_date DESC LIMIT 1`,
  ]).catch(() => [[], []] as [Array<Record<string, unknown>>, Array<Record<string, unknown>>]);
  const s=summary[0] ?? {};
  const metricByPath: Record<string,string> = {
    "/os": `${Number(s.open_tasks ?? 0)} open tasks`,
    "/os/strategy": `${Number(s.goals ?? 0)} goals`,
    "/os/sprint": `${Number(s.open_tasks ?? 0)} open tasks`,
    "/os/skills": `${Number(s.skills ?? 0)} skills`,
    "/os/career": `${Number(s.career_targets ?? 0)} targets`,
    "/os/business": `${Number(s.deals ?? 0)} deals`,
    "/os/wealth": "Private ledger",
    "/os/reviews": "Review loop",
  };

  return (
    <main className="os-shell">
      <header className="os-topbar">
        <div>
          <Link className="text-link" href="/"><ArrowLeft size={15} /> Public profile</Link>
          <div className="kicker" style={{ marginTop: 20 }}>Yusuf Personal OS</div>
          <h1>Command your next move.</h1>
          <p className="section-lead">Private command center for turning strategy into execution, execution into proof, and proof into higher personal value, opportunity and freedom.</p>
        </div>
        <div className="os-user"><UserMenu user={user} /></div>
      </header>

      <section className="os-hero-grid">
        <article className="os-highlight">
          <span className="kicker">Today</span>
          <h2>Make progress visible.</h2>
          <p>{Number(s.open_tasks ?? 0)} open tasks, {Number(s.unprocessed_captures ?? 0)} captures waiting for processing, and {Number(s.next_actions ?? 0)} ranked next actions.</p>
          <div className="actions"><Link className="btn btn-dark" href="/os/quick-capture">Quick Capture <ArrowUpRight size={15} /></Link><Link className="btn btn-secondary" href="/os/intelligence">Open intelligence <ArrowUpRight size={15} /></Link></div>
        </article>
        <article className="os-status">
          <div><span className="kicker">System state</span><strong>Identity verified</strong><p>Firebase Auth is active for this session. Private records are always queried with the authenticated owner boundary.</p></div>
          <div className="os-stat-row"><span><small>Personal Value</small><b>{scores[0]?.personal_value ?? "Not measured"}</b></span><span><small>Projects</small><b>{s.projects ?? 0}</b></span></div>
        </article>
      </section>

      <section style={{ marginTop: 48 }}>
        <div className="section-head"><div><div className="kicker">Google Workspace</div><h2>Your Digital Life</h2></div><p className="section-lead">Real-time sync of your emails, calendar, tasks and files directly pulled via Google Workspace APIs.</p></div>
        <WorkspaceDashboard />
      </section>

      <section style={{ marginTop: 48 }}>
        <div className="section-head"><div><div className="kicker">Core workspace</div><h2>One operating system.</h2></div><p className="section-lead">Every module is now connected to the private workspace routes, so the command center is a real navigation hub rather than a static concept screen.</p></div>
        <div className="os-module-grid">
          {modules.map(([title, text, href, Icon]) => (
            <Link className="card os-module" key={title} href={href}>
              <Icon size={19} />
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="os-module-link">{metricByPath[href] || "Open module"} <ArrowUpRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta" style={{ marginTop: 70, borderRadius: 26 }}>
        <div className="container" style={{ padding: "56px 0" }}>
          <div className="kicker">Operating loop</div>
          <h2>Plan → Execute → Capture → Prove → Measure → Review → Replan.</h2>
          <p>The intelligence layer will recommend high-leverage next actions while Yusuf remains the decision maker.</p>
        </div>
      </section>
    </main>
  );
}
