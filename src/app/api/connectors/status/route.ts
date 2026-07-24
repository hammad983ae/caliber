import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isConnected as isGoogleCalendarConnected } from "@/lib/connectors/google-calendar";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_calendar = await isGoogleCalendarConnected(userId);
  return NextResponse.json({ google_calendar });
}
