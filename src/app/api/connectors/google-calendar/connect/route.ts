import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GOOGLE_CALENDAR_SCOPE } from "@/lib/connectors/google-calendar";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const url = new URL("/dashboard/settings", req.url);
    url.searchParams.set("connector_error", "not_configured");
    return NextResponse.redirect(url);
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = new URL("/api/connectors/google-calendar/callback", req.url).toString();

  const authUrl = new URL(AUTH_ENDPOINT);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", GOOGLE_CALENDAR_SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("gcal_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
