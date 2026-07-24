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
- `src/lib/firestore` — server-only Firestore data-access layer (`automations.ts`, `activity.ts`)
- `src/components/landing` — landing page sections
- `src/lib/firebase` — Firebase client (`client.ts`) and admin (`admin.ts`) SDK setup
- `src/proxy.ts` — Clerk auth gate (Next.js 16 Proxy, formerly Middleware)

## Environment variables

See `.env.example` for the full list:

- **Clerk** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` from the [Clerk dashboard](https://dashboard.clerk.com).
- **Firebase (client)** — `NEXT_PUBLIC_FIREBASE_*` from your Firebase project settings.
- **Firebase (admin)** — for server-side Firestore access, either `FIREBASE_SERVICE_ACCOUNT_KEY` (the full service account JSON as a single-line string) or the individual `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` fields (this is how Vercel's Firebase integration sets them).

Before any of this works, the Firebase project needs an actual Firestore database provisioned — Firebase Console → **Build → Firestore Database → Create database** (Native mode, any region). A project can exist with Auth/Storage configured but no Firestore instance yet, which surfaces as a `5 NOT_FOUND` error from the Admin SDK. The `automations` and `activity` collections themselves need no manual setup — they're created automatically on first write.
