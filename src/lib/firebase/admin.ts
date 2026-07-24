import "server-only";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set. Add the service account JSON (as a single-line string) to your environment."
    );
  }

  return initializeApp({
    credential: cert(JSON.parse(serviceAccountKey)),
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
