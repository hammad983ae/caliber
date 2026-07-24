import "server-only";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

export const adminDb = getFirestore(getAdminApp());
