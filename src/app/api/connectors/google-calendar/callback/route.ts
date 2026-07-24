import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { saveTokens } from "@/lib/connectors/google-calendar";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export async function GET(req: Request) {
  const { userId } = await auth();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const settingsUrl = new URL("/dashboard/settings", req.url);

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (oauthError) {
    settingsUrl.searchParams.set("connector_error", oauthError);
    return NextResponse.redirect(settingsUrl);
  }

  const cookieStore = await cookies();
  const cookieState = cookieStore.get("gcal_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    settingsUrl.searchParams.set("connector_error", "invalid_state");
    return NextResponse.redirect(settingsUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    settingsUrl.searchParams.set("connector_error", "not_configured");
    return NextResponse.redirect(settingsUrl);
  }

  const redirectUri = new URL("/api/connectors/google-calendar/callback", req.url).toString();

  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    settingsUrl.searchParams.set("connector_error", "token_exchange_failed");
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.delete("gcal_oauth_state");
    return response;
  }

  const tokens = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    error?: string;
    error_description?: string;
  };

  try {
    if (tokens.error) {
      throw new Error(`${tokens.error}: ${tokens.error_description ?? "no description"}`);
    }
    await saveTokens(userId, {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in!,
      scope: tokens.scope!,
    });
    settingsUrl.searchParams.set("connected", "google_calendar");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[google-calendar] failed to save the connection: ${message}`);
    settingsUrl.searchParams.set("connector_error", "save_failed");
    settingsUrl.searchParams.set("connector_debug", message.slice(0, 300));
  }

  const response = NextResponse.redirect(settingsUrl);
  response.cookies.delete("gcal_oauth_state");
  return response;
}
