import "server-only";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import type { Automation, AutomationStatus, FlowStep, LastRun } from "@/lib/automations";

const COLLECTION = "automations";

export interface AutomationDoc {
  name: string;
  status: AutomationStatus;
  connectors: string[];
  steps: FlowStep[];
  lastRun: LastRun | null;
  /** Machine-readable timestamp of the last run (manual or automatic), used to avoid double-firing the same day. */
  lastRunAtISO: string | null;
  /** Baseline row count for "new row in a spreadsheet" triggers — null until the runner has checked once. */
  lastRowCount: number | null;
  scope: "personal" | "team";
  orgId: string | null;
  alwaysAllow: boolean;
  createdBy: { name: string; imageUrl?: string } | null;
  ownerId: string;
  createdAt: Timestamp | null;
}

export interface Owner {
  userId: string;
  orgId: string | null;
}

function toAutomation(id: string, doc: AutomationDoc): Automation {
  return {
    id,
    name: doc.name,
    status: doc.status,
    connectors: doc.connectors,
    steps: doc.steps,
    lastRun: doc.lastRun,
    scope: doc.scope,
    orgId: doc.orgId ?? undefined,
    alwaysAllow: doc.alwaysAllow,
    createdBy: doc.createdBy ?? undefined,
  };
}

export async function listAutomations(owner: Owner): Promise<Automation[]> {
  const db = getAdminDb();
  const query = owner.orgId
    ? db.collection(COLLECTION).where("scope", "==", "team").where("orgId", "==", owner.orgId)
    : db
        .collection(COLLECTION)
        .where("scope", "==", "personal")
        .where("ownerId", "==", owner.userId);

  const snap = await query.get();
  return snap.docs
    .map((d) => ({ id: d.id, data: d.data() as AutomationDoc }))
    .sort((a, b) => (b.data.createdAt?.toMillis() ?? 0) - (a.data.createdAt?.toMillis() ?? 0))
    .map(({ id, data }) => toAutomation(id, data));
}

export async function createAutomation(
  owner: Owner,
  input: {
    name: string;
    status: AutomationStatus;
    connectors: string[];
    steps: FlowStep[];
    alwaysAllow?: boolean;
    createdBy?: { name: string; imageUrl?: string };
  },
): Promise<Automation> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc();
  await ref.set({
    name: input.name,
    status: input.status,
    connectors: input.connectors,
    steps: input.steps,
    lastRun: null,
    lastRunAtISO: null,
    lastRowCount: null,
    scope: owner.orgId ? "team" : "personal",
    orgId: owner.orgId,
    alwaysAllow: input.alwaysAllow ?? false,
    createdBy: input.createdBy ?? null,
    ownerId: owner.userId,
    createdAt: FieldValue.serverTimestamp(),
  });
  const snap = await ref.get();
  return toAutomation(ref.id, snap.data() as AutomationDoc);
}

async function findOwned(id: string, owner: Owner) {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;

  const data = snap.data() as AutomationDoc;
  const owns = data.scope === "team" ? data.orgId === owner.orgId : data.ownerId === owner.userId;
  if (!owns) return null;

  return { ref, data };
}

export async function getOwnedAutomation(id: string, owner: Owner) {
  return findOwned(id, owner);
}

export async function updateAutomation(
  id: string,
  owner: Owner,
  patch: Partial<Pick<AutomationDoc, "status" | "alwaysAllow" | "lastRun" | "lastRunAtISO">>,
): Promise<Automation | null> {
  const found = await findOwned(id, owner);
  if (!found) return null;

  await found.ref.update(patch);
  const snap = await found.ref.get();
  return toAutomation(id, snap.data() as AutomationDoc);
}

export async function deleteAutomation(id: string, owner: Owner): Promise<boolean> {
  const found = await findOwned(id, owner);
  if (!found) return false;

  await found.ref.delete();
  return true;
}

/** System-level read used by the scheduled runner — spans every owner, not just one. */
export async function listActiveAutomations(): Promise<{ id: string; data: AutomationDoc }[]> {
  const db = getAdminDb();
  const snap = await db.collection(COLLECTION).where("status", "==", "active").get();
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as AutomationDoc }));
}

/** System-level write used by the scheduled runner, which has no single owner making the request. */
export async function recordAutomationRun(
  id: string,
  patch: { lastRun: LastRun; lastRunAtISO: string; lastRowCount?: number },
): Promise<void> {
  await getAdminDb().collection(COLLECTION).doc(id).update(patch);
}

/** Records a row-count baseline without logging a run — used the first time a "new row" trigger is checked. */
export async function recordRowCountBaseline(id: string, count: number): Promise<void> {
  await getAdminDb().collection(COLLECTION).doc(id).update({ lastRowCount: count });
}
