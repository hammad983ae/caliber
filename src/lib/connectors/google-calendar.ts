import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const EVENTS_ENDPOINT = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";

interface StoredTokens {
  provider: "google_calendar";
  ownerType: "user";
  ownerId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
  connectedAt: number;
}

function tokenDoc(userId: string) {
  return getAdminDb().collection("connectorTokens").doc(`${userId}_google_calendar`);
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
    provider: "google_calendar",
    ownerType: "user",
    ownerId: userId,
    accessToken: tokens.access_token,
    refreshToken,
    expiresAt: Date.now() + tokens.expires_in * 1000,
    scope: tokens.scope,
    connectedAt: prev?.connectedAt ?? Date.now(),
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
    throw new Error("Google Calendar isn't connected for this account.");
  }
  const data = snap.data() as StoredTokens;
  const stillFresh = Date.now() < data.expiresAt - 60_000;
  return stillFresh ? data.accessToken : refreshAccessToken(userId, data.refreshToken);
}

export async function createCalendarEvent(
  userId: string,
  { summary, startISO, endISO }: { summary: string; startISO: string; endISO: string },
): Promise<{ id: string; htmlLink: string }> {
  const accessToken = await getValidAccessToken(userId);

  const res = await fetch(EVENTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary,
      start: { dateTime: startISO },
      end: { dateTime: endISO },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create calendar event: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<{ id: string; htmlLink: string }>;
}
