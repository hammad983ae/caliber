import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { disconnect } from "@/lib/connectors/google-calendar";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await disconnect(userId);
  return NextResponse.json({ ok: true });
}
