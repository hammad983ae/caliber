import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAutomation, listAutomations } from "@/lib/firestore/automations";
import type { AutomationStatus, FlowStep } from "@/lib/automations";

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  try {
    const automations = await listAutomations({ userId, orgId: orgId ?? null });
    return NextResponse.json({ automations });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    status?: AutomationStatus;
    connectors?: string[];
    steps?: FlowStep[];
    alwaysAllow?: boolean;
    createdBy?: { name: string; imageUrl?: string };
  } | null;

  if (!body?.name || !Array.isArray(body.steps) || body.steps.length === 0) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const automation = await createAutomation(
      { userId, orgId: orgId ?? null },
      {
        name: body.name,
        status: body.status ?? "active",
        connectors: Array.isArray(body.connectors) ? body.connectors : [],
        steps: body.steps,
        alwaysAllow: body.alwaysAllow,
        createdBy: body.createdBy,
      },
    );
    return NextResponse.json({ automation });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
