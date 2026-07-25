# Caliber

Voice-driven automation app. See [`docs/PRD-voice-automation-app.md`](docs/PRD-voice-automation-app.md) for the full product spec.

Built with Next.js (App Router), [Clerk](https://clerk.com) for auth, and [Firebase](https://firebase.google.com) (Firestore) for data.

## Getting started

1. Copy `.env.example` to `.env.local` and fill in your Clerk and Firebase keys.
2. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project structure

- `src/app` — routes (App Router)
- `src/app/api/automations`, `src/app/api/activity` — Firestore-backed CRUD for automations and the activity log, scoped per user (personal workspace) or per Clerk organization (team workspace)
- `src/app/api/cron/run-automations` — the scheduled runner (see below)
- `src/lib/firestore` — server-only Firestore data-access layer (`automations.ts`, `activity.ts`)
- `src/lib/automation-schedule.ts` — parses a trigger step's free-text description into a daily/weekly cadence
- `src/lib/ai/automation-builder.ts` — calls Gemini to turn a chat message into trigger/action steps for the create-automation screen
- `src/components/landing` — landing page sections
- `src/lib/firebase` — Firebase client (`client.ts`) and admin (`admin.ts`) SDK setup
- `src/proxy.ts` — Clerk auth gate (Next.js 16 Proxy, formerly Middleware)

## Automatic runs

Active automations run on their own once a day via a [Vercel Cron Job](https://vercel.com/docs/cron-jobs) configured in `vercel.json`, hitting `/api/cron/run-automations`, if their trigger step matches one of two patterns:
- **Time-based** — reads as a recurring cadence (contains a weekday name, "every day", "daily", "every morning/evening/night", etc).
- **New spreadsheet row** — reads as "new row"/"row added"/"added to the sheet" etc. The runner compares the connected sheet's row count against what it saw on the last check; the very first check just records a baseline (so it doesn't fire on rows that already existed), and each later check fires once if the count grew, then updates the baseline so it doesn't re-fire on the same rows tomorrow.

Triggers with no real signal to watch at all (voice phrases, form submissions, presence) stay manual-only — there's nothing to schedule against yet.

When a run fires:
- Any step using a real connector (Google Calendar, Google Sheets) actually executes, using the account connected by the automation's creator.
- Steps on connectors that aren't wired up for real yet (Slack, Gmail, Hue, Notion, Spotify) are recorded as skipped rather than faked — the plan is to wire these up for real one at a time, the same way Calendar and Sheets were.
- Either way, a real activity log entry is written and the automation's "last run" status updates.

Requires `CRON_SECRET` to be set (see `.env.example`) — Vercel sends it automatically as a bearer token when invoking the job. Vercel's Hobby plan only allows daily cron schedules; sub-daily schedules (hourly, every 15 min) require Pro. Because of that once-a-day cadence, an automation only actually fires once per matching day regardless of the specific time-of-day mentioned in its trigger text (e.g. "every day at 8am" runs once daily, not exactly at 8am).

### Google Sheets connector

Unlike Calendar (always the "primary" calendar), a Sheets step needs to know *which* spreadsheet to write to. After connecting Google Sheets in Settings, paste a spreadsheet's URL (or raw ID) and a sheet/tab name (defaults to `Sheet1`) into the form that appears — `src/app/api/connectors/google-sheets/config/route.ts` parses either form and stores it alongside that connector's OAuth tokens. Running a Sheets step appends one row via `spreadsheets.values.append`; since there's no real upstream trigger data yet (no live lead-form webhook), the appended row is a placeholder (timestamp, automation name, a note that it was triggered by Caliber) — same "proves the real API call works end-to-end" spirit as Calendar's placeholder event.

## Environment variables

See `.env.example` for the full list:

- **Clerk** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` from the [Clerk dashboard](https://dashboard.clerk.com).
- **Firebase (client)** — `NEXT_PUBLIC_FIREBASE_*` from your Firebase project settings.
- **Firebase (admin)** — for server-side Firestore access, either `FIREBASE_SERVICE_ACCOUNT_KEY` (the full service account JSON as a single-line string) or the individual `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` fields (this is how Vercel's Firebase integration sets them).
- **Gemini** — `GEMINI_API_KEY`, a free-tier key from [Google AI Studio](https://aistudio.google.com/apikey), powers the create-automation chat's intent parsing.

Before any of this works, the Firebase project needs an actual Firestore database provisioned — Firebase Console → **Build → Firestore Database → Create database** (Native mode, any region). A project can exist with Auth/Storage configured but no Firestore instance yet, which surfaces as a `5 NOT_FOUND` error from the Admin SDK. The `automations` and `activity` collections themselves need no manual setup — they're created automatically on first write.
