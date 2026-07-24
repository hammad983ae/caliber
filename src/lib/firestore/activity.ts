import "server-only";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import type { ActivityEntry } from "@/lib/activity";
import type { Owner } from "@/lib/firestore/automations";

const COLLECTION = "activity";

interface ActivityDoc {
  automationId: string;
  automationName: string;
  connectors: string[];
  status: ActivityEntry["status"];
  at: string;
  summary: string;
  undoable: boolean;
  scope: "personal" | "team";
  orgId: string | null;
  ownerId: string;
  ranBy: { name: string; imageUrl?: string } | null;
  createdAt: Timestamp | null;
}

function toEntry(id: string, doc: ActivityDoc): ActivityEntry {
  return {
    id,
    automationId: doc.automationId,
    automationName: doc.automationName,
    connectors: doc.connectors,
    status: doc.status,
    at: doc.at,
    summary: doc.summary,
    undoable: doc.undoable,
    scope: doc.scope,
    ranBy: doc.ranBy ?? undefined,
  };
}

export async function listActivity(owner: Owner): Promise<ActivityEntry[]> {
  const db = getAdminDb();
  const query = owner.orgId
    ? db.collection(COLLECTION).where("scope", "==", "team").where("orgId", "==", owner.orgId)
    : db.collection(COLLECTION).where("scope", "==", "personal").where("ownerId", "==", owner.userId);

  const snap = await query.get();
  return snap.docs
    .map((d) => ({ id: d.id, data: d.data() as ActivityDoc }))
    .sort((a, b) => (b.data.createdAt?.toMillis() ?? 0) - (a.data.createdAt?.toMillis() ?? 0))
    .map(({ id, data }) => toEntry(id, data));
}

export async function createActivityEntry(
  owner: Owner,
  input: {
    automationId: string;
    automationName: string;
    connectors: string[];
    status: ActivityEntry["status"];
    at: string;
    summary: string;
    undoable: boolean;
    ranBy?: { name: string; imageUrl?: string };
  },
): Promise<ActivityEntry> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc();
  await ref.set({
    automationId: input.automationId,
    automationName: input.automationName,
    connectors: input.connectors,
    status: input.status,
    at: input.at,
    summary: input.summary,
    undoable: input.undoable,
    scope: owner.orgId ? "team" : "personal",
    orgId: owner.orgId,
    ownerId: owner.userId,
    ranBy: input.ranBy ?? null,
    createdAt: FieldValue.serverTimestamp(),
  });
  const snap = await ref.get();
  return toEntry(ref.id, snap.data() as ActivityDoc);
}

export async function undoActivityEntry(id: string, owner: Owner): Promise<ActivityEntry | null> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;

  const data = snap.data() as ActivityDoc;
  const owns = data.scope === "team" ? data.orgId === owner.orgId : data.ownerId === owner.userId;
  if (!owns) return null;

  const summary = data.undoable ? `${data.summary} (undone)` : data.summary;
  await ref.update({ undoable: false, summary });
  const updated = await ref.get();
  return toEntry(id, updated.data() as ActivityDoc);
}
