import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isConnected as isGoogleCalendarConnected } from "@/lib/connectors/google-calendar";
import { isConnected as isGoogleSheetsConnected } from "@/lib/connectors/google-sheets";
import { getMockConnections } from "@/lib/connectors/mock-connectors";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [google_calendar, google_sheets, mockConnections] = await Promise.all([
    isGoogleCalendarConnected(userId),
    isGoogleSheetsConnected(userId),
    getMockConnections(userId),
  ]);

  return NextResponse.json({ google_calendar, google_sheets, ...mockConnections });
}
