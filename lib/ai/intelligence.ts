import type { getDb } from "@/lib/db/server";

type Db = NonNullable<ReturnType<typeof getDb>>;

const clamp = (n: number) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));

export async function refreshNextBestActions(db: Db, ownerId: string) {
  const [openTasks, openCaptures, stalledGoals, staleSkills, activeDeals, skills, validatedSkills, publishedProjects, activeAccounts, interactions, assets, liabilities] = await Promise.all([
    db`SELECT COUNT(*)::int AS count FROM public.tasks WHERE owner_id=${ownerId}::uuid AND status NOT IN ('done','completed')`,
    db`SELECT COUNT(*)::int AS count FROM public.quick_captures WHERE owner_id=${ownerId}::uuid AND processed=false`,
    db`SELECT COUNT(*)::int AS count FROM public.goals WHERE owner_id=${ownerId}::uuid AND status NOT IN ('done','completed') AND COALESCE(progress,0) < 30`,
    db`SELECT COUNT(*)::int AS count FROM public.skills WHERE owner_id=${ownerId}::uuid AND validated=false`,
    db`SELECT COUNT(*)::int AS count FROM public.deals WHERE owner_id=${ownerId}::uuid AND stage NOT IN ('won','lost','closed')`,
    db`SELECT COUNT(*)::int AS count FROM public.skills WHERE owner_id=${ownerId}::uuid`,
    db`SELECT COUNT(*)::int AS count FROM public.skills WHERE owner_id=${ownerId}::uuid AND validated=true`,
    db`SELECT COUNT(*)::int AS count FROM public.projects WHERE owner_id=${ownerId}::uuid AND visibility='published'`,
    db`SELECT COUNT(*)::int AS count FROM public.social_accounts WHERE owner_id=${ownerId}::uuid AND active=true`,
    db`SELECT COUNT(*)::int AS count FROM public.interactions WHERE owner_id=${ownerId}::uuid`,
    db`SELECT COALESCE(SUM(current_value),0)::numeric AS total FROM public.assets WHERE owner_id=${ownerId}::uuid`,
    db`SELECT COALESCE(SUM(balance),0)::numeric AS total FROM public.liabilities WHERE owner_id=${ownerId}::uuid`,
  ]);

  const candidates = [
    { title: "Process untriaged captures", reason: `${openCaptures[0]?.count ?? 0} capture(s) are waiting for processing. Convert raw notes into tasks, goals, evidence or decisions.`, impact: 9, effort: 20 },
    { title: "Close one high-priority task", reason: `${openTasks[0]?.count ?? 0} open task(s) remain. Pick the highest-leverage item and finish it before adding more work.`, impact: 8, effort: 30 },
    { title: "Rescue a stalled goal", reason: `${stalledGoals[0]?.count ?? 0} goal(s) have low progress. Identify the smallest next action and attach it to the active sprint.`, impact: 9, effort: 25 },
    { title: "Validate one capability", reason: `${staleSkills[0]?.count ?? 0} skill(s) are not yet validated. Attach recent evidence or schedule an assessment.`, impact: 7, effort: 35 },
    { title: "Advance one commercial opportunity", reason: `${activeDeals[0]?.count ?? 0} deal(s) are still active. Move the next one toward a concrete buyer, supplier or customer action.`, impact: 9, effort: 40 },
  ];
  const active = candidates.filter((c) => !c.reason.startsWith("0 ")).sort((a,b) => b.impact - a.impact || a.effort - b.effort).slice(0,5);

  await db`UPDATE public.next_best_actions SET status='dismissed' WHERE owner_id=${ownerId}::uuid AND status NOT IN ('done')`;
  for (let index=0; index<active.length; index++) {
    const action=active[index];
    await db`INSERT INTO public.next_best_actions (owner_id, title, reason, impact_score, effort_minutes, priority_rank, status) VALUES (${ownerId}::uuid, ${action.title}, ${action.reason}, ${action.impact}, ${action.effort}, ${index+1}, 'proposed')`;
  }

  const capability = clamp((Number(validatedSkills[0]?.count ?? 0) / Math.max(Number(skills[0]?.count ?? 0), 1)) * 100);
  const proof = clamp((Number(publishedProjects[0]?.count ?? 0) / 3) * 100);
  const distribution = clamp((Number(activeAccounts[0]?.count ?? 0) / 4) * 100);
  const network = clamp((Number(interactions[0]?.count ?? 0) / 20) * 100);
  const commercialization = clamp((Number(activeDeals[0]?.count ?? 0) / 3) * 100);
  const assetTotal = Number(assets[0]?.total ?? 0);
  const liabilityTotal = Number(liabilities[0]?.total ?? 0);
  const ownership = assetTotal + liabilityTotal > 0 ? clamp((assetTotal / (assetTotal + liabilityTotal)) * 100) : 0;
  const personalValue = Number(((capability + proof + distribution + network + commercialization + ownership) / 6).toFixed(1));

  await db`
    INSERT INTO public.score_snapshots (owner_id, snapshot_date, capability, proof, distribution, network, commercialization, ownership, personal_value)
    VALUES (${ownerId}::uuid, CURRENT_DATE, ${capability}, ${proof}, ${distribution}, ${network}, ${commercialization}, ${ownership}, ${personalValue})
    ON CONFLICT (owner_id, snapshot_date) DO UPDATE SET capability=EXCLUDED.capability, proof=EXCLUDED.proof, distribution=EXCLUDED.distribution, network=EXCLUDED.network, commercialization=EXCLUDED.commercialization, ownership=EXCLUDED.ownership, personal_value=EXCLUDED.personal_value;
  `;

  return active.length;
}
