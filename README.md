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
- `src/components/landing` — landing page sections
- `src/lib/firebase` — Firebase client (`client.ts`) and admin (`admin.ts`) SDK setup
- `src/proxy.ts` — Clerk auth gate (Next.js 16 Proxy, formerly Middleware)

## Environment variables

See `.env.example` for the full list:

- **Clerk** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` from the [Clerk dashboard](https://dashboard.clerk.com).
- **Firebase (client)** — `NEXT_PUBLIC_FIREBASE_*` from your Firebase project settings.
- **Firebase (admin)** — `FIREBASE_SERVICE_ACCOUNT_KEY`, a service account JSON as a single-line string, for server-side Firestore access.
