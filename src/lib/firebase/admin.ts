import "server-only";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  // Prefer a single JSON blob if present, otherwise fall back to individual
  // FIREBASE_* fields (e.g. as set by Vercel's Firebase integration, which
  // splits the service account JSON into one env var per field).
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccountKey)),
    });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are not set. Set FIREBASE_SERVICE_ACCOUNT_KEY (the full service account JSON), or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY individually.",
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Most env var UIs (including Vercel) store multi-line values with
      // literal "\n" escape sequences rather than real newlines; normalize
      // either form since a PEM key requires actual line breaks.
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

let cachedDb: Firestore | null = null;

/**
 * Lazily initializes the Admin SDK on first use, rather than at module load
 * time — otherwise every route that imports this module would require a
 * valid FIREBASE_SERVICE_ACCOUNT_KEY at build time, not just at request time.
 */
export function getAdminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getAdminApp());
  }
  return cachedDb;
}
