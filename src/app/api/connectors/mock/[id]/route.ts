import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isMockConnectorId, setMockConnection } from "@/lib/connectors/mock-connectors";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  if (!isMockConnectorId(id)) {
    return NextResponse.json({ error: "unknown_connector" }, { status: 404 });
  }

  await setMockConnection(userId, id, true);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  if (!isMockConnectorId(id)) {
    return NextResponse.json({ error: "unknown_connector" }, { status: 404 });
  }

  await setMockConnection(userId, id, false);
  return NextResponse.json({ ok: true });
}
