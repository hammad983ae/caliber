import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { undoActivityEntry } from "@/lib/firestore/activity";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const entry = await undoActivityEntry(id, { userId, orgId: orgId ?? null });
  if (!entry) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ entry });
}
