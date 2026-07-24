export interface ActivityEntry {
  id: string;
  automationId: string;
  automationName: string;
  connectors: string[];
  status: "success" | "partial" | "failed";
  at: string;
  summary: string;
  undoable: boolean;
  scope: "personal" | "team";
  ranBy?: { name: string; imageUrl?: string };
}
