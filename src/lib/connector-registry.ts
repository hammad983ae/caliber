export type ConnectorId =
  | "google_calendar"
  | "gmail"
  | "slack"
  | "notion"
  | "spotify"
  | "philips_hue";

export interface ConnectorInfo {
  id: ConnectorId;
  name: string;
  /** Category glyph key, matches ConnectorIcon — used as a fallback when there's no brand logo. */
  icon: string;
  /** Real OAuth-backed connector vs. a placeholder toggle. */
  real: boolean;
}

export const CONNECTORS: Record<ConnectorId, ConnectorInfo> = {
  google_calendar: { id: "google_calendar", name: "Google Calendar", icon: "calendar", real: true },
  gmail: { id: "gmail", name: "Gmail", icon: "mail", real: false },
  slack: { id: "slack", name: "Slack", icon: "message", real: false },
  notion: { id: "notion", name: "Notion", icon: "doc", real: false },
  spotify: { id: "spotify", name: "Spotify", icon: "music", real: false },
  philips_hue: { id: "philips_hue", name: "Philips Hue", icon: "bulb", real: false },
};

export const CONNECTOR_IDS = Object.keys(CONNECTORS) as ConnectorId[];

export function isConnectorId(value: string): value is ConnectorId {
  return (CONNECTOR_IDS as string[]).includes(value);
}

/** Connectors with no real OAuth integration yet — connecting just flips a persisted flag. */
export const MOCK_CONNECTOR_IDS = CONNECTOR_IDS.filter((id) => !CONNECTORS[id].real);
