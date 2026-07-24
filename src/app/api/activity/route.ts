import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listActivity } from "@/lib/firestore/activity";

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  try {
    const entries = await listActivity({ userId, orgId: orgId ?? null });
    return NextResponse.json({ entries });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
