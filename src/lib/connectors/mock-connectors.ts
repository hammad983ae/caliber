import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { MOCK_CONNECTOR_IDS, type ConnectorId } from "@/lib/connector-registry";

export type MockConnectorId = Exclude<ConnectorId, "google_calendar" | "google_sheets">;

export function isMockConnectorId(value: string): value is MockConnectorId {
  return (MOCK_CONNECTOR_IDS as string[]).includes(value);
}

function doc(userId: string) {
  return getAdminDb().collection("mockConnections").doc(userId);
}

export async function getMockConnections(
  userId: string,
): Promise<Record<MockConnectorId, boolean>> {
  const snap = await doc(userId).get();
  const data = (snap.data() ?? {}) as Partial<Record<MockConnectorId, boolean>>;
  return Object.fromEntries(
    (MOCK_CONNECTOR_IDS as MockConnectorId[]).map((id) => [id, Boolean(data[id])]),
  ) as Record<MockConnectorId, boolean>;
}

export async function setMockConnection(
  userId: string,
  id: MockConnectorId,
  connected: boolean,
): Promise<void> {
  await doc(userId).set({ [id]: connected }, { merge: true });
}
