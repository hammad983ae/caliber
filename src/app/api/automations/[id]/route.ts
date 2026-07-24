import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  deleteAutomation,
  getOwnedAutomation,
  updateAutomation,
} from "@/lib/firestore/automations";
import type { AutomationStatus } from "@/lib/automations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, orgId, orgRole } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const owner = { userId, orgId: orgId ?? null };
  const found = await getOwnedAutomation(id, owner);
  if (!found) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as {
    status?: AutomationStatus;
    alwaysAllow?: boolean;
  } | null;

  const isApproving = found.data.status === "pending_approval" && body?.status === "active";
  if (isApproving && orgRole !== "org:admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const patch: { status?: AutomationStatus; alwaysAllow?: boolean } = {};
  if (typeof body?.status === "string") patch.status = body.status;
  if (typeof body?.alwaysAllow === "boolean") patch.alwaysAllow = body.alwaysAllow;

  try {
    const automation = await updateAutomation(id, owner, patch);
    return NextResponse.json({ automation });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, orgId, orgRole } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const owner = { userId, orgId: orgId ?? null };
  const found = await getOwnedAutomation(id, owner);
  if (!found) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (found.data.status === "pending_approval" && orgRole !== "org:admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await deleteAutomation(id, owner);
  return NextResponse.json({ ok: true });
}
