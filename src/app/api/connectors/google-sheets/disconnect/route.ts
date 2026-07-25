import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { disconnect } from "@/lib/connectors/google-sheets";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  await disconnect(userId);
  return NextResponse.json({ ok: true });
}
