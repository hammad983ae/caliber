import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

export const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

interface StoredTokens {
  provider: "google_sheets";
  ownerType: "user";
  ownerId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
  connectedAt: number;
  spreadsheetId?: string;
  sheetName?: string;
}

function tokenDoc(userId: string) {
  return getAdminDb().collection("connectorTokens").doc(`${userId}_google_sheets`);
}

export async function saveTokens(
  userId: string,
  tokens: { access_token: string; refresh_token?: string; expires_in: number; scope: string },
) {
  const ref = tokenDoc(userId);
  const existing = await ref.get();
  const prev = existing.data() as StoredTokens | undefined;

  const refreshToken = tokens.refresh_token ?? prev?.refreshToken;
  if (!refreshToken) {
    throw new Error(
      "Google didn't return a refresh token and none was stored previously — reconnect with prompt=consent.",
    );
  }

  const record: StoredTokens = {
    provider: "google_sheets",
    ownerType: "user",
    ownerId: userId,
    accessToken: tokens.access_token,
    refreshToken,
    expiresAt: Date.now() + tokens.expires_in * 1000,
    scope: tokens.scope,
    connectedAt: prev?.connectedAt ?? Date.now(),
    spreadsheetId: prev?.spreadsheetId,
    sheetName: prev?.sheetName,
  };

  await ref.set(record);
}

export async function isConnected(userId: string): Promise<boolean> {
  const snap = await tokenDoc(userId).get();
  return snap.exists;
}

export async function disconnect(userId: string) {
  await tokenDoc(userId).delete();
}

export async function getSheetConfig(
  userId: string,
): Promise<{ spreadsheetId: string | null; sheetName: string }> {
  const snap = await tokenDoc(userId).get();
  const data = snap.data() as StoredTokens | undefined;
  return { spreadsheetId: data?.spreadsheetId ?? null, sheetName: data?.sheetName ?? "Sheet1" };
}

export async function setSheetConfig(
  userId: string,
  config: { spreadsheetId: string; sheetName?: string },
): Promise<void> {
  await tokenDoc(userId).set(
    { spreadsheetId: config.spreadsheetId, sheetName: config.sheetName || "Sheet1" },
    { merge: true },
  );
}

async function refreshAccessToken(userId: string, refreshToken: string): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured (missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET).");
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh Google token: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  await tokenDoc(userId).update({
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  });
  return data.access_token;
}

export async function getValidAccessToken(userId: string): Promise<string> {
  const snap = await tokenDoc(userId).get();
  if (!snap.exists) {
    throw new Error("Google Sheets isn't connected for this account.");
  }
  const data = snap.data() as StoredTokens;
  const stillFresh = Date.now() < data.expiresAt - 60_000;
  return stillFresh ? data.accessToken : refreshAccessToken(userId, data.refreshToken);
}

export async function appendRow(
  userId: string,
  { values }: { values: string[] },
): Promise<{ updatedRange: string }> {
  const { spreadsheetId, sheetName } = await getSheetConfig(userId);
  if (!spreadsheetId) {
    throw new Error("No spreadsheet configured — add one in Settings first.");
  }

  const accessToken = await getValidAccessToken(userId);
  const range = encodeURIComponent(sheetName);

  const res = await fetch(
    `${SHEETS_API}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to append to Google Sheets: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { updates?: { updatedRange?: string } };
  return { updatedRange: data.updates?.updatedRange ?? sheetName };
}
