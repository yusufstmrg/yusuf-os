import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db/server";

type Db = NonNullable<ReturnType<typeof getDb>>;

export async function requirePrivateDb(): Promise<{ user: { id: string; name?: string | null; email: string }; db: Db }> {
  console.log("requirePrivateDb auth:", auth ? "exists" : "null/undefined");
  if (!auth) redirect("/login?reason=auth_setup");
  const result = await auth.getSession();
  const session = result.data?.session;
  const user = result.data?.user;
  if (!session || !user) redirect("/login");
  const db = getDb();
  if (!db) redirect("/login?reason=database_setup");
  return { user, db };
}
