import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSheetConfig, setSheetConfig } from "@/lib/connectors/google-sheets";

/** Accepts either a raw spreadsheet ID or a full Google Sheets URL. */
function extractSpreadsheetId(input: string): string | null {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) return urlMatch[1];
  if (/^[a-zA-Z0-9-_]+$/.test(trimmed)) return trimmed;
  return null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const config = await getSheetConfig(userId);
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    spreadsheet?: string;
    sheetName?: string;
  } | null;

  const spreadsheetId = body?.spreadsheet ? extractSpreadsheetId(body.spreadsheet) : null;
  if (!spreadsheetId) {
    return NextResponse.json({ error: "invalid_spreadsheet" }, { status: 400 });
  }

  await setSheetConfig(userId, { spreadsheetId, sheetName: body?.sheetName });
  return NextResponse.json({ ok: true, spreadsheetId });
}
