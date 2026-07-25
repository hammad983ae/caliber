"use client";

import { useCallback, useEffect, useState } from "react";
import type { ConnectorId } from "@/lib/connector-registry";

export type ConnectorStatus = Partial<Record<ConnectorId, boolean>>;

/**
 * Shared connector-status fetcher. Refetches on window focus so that
 * connecting an app in another tab (Google Calendar's OAuth flow opens in
 * one) is picked up without the user having to manually refresh.
 */
export function useConnectorStatus() {
  const [status, setStatus] = useState<ConnectorStatus>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/connectors/status");
      const data = await res.json();
      setStatus(data);
    } catch {
      // Leave prior status in place; connect prompts default to "not connected".
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await refresh();
      if (!cancelled) setLoading(false);
    }

    load();

    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  return { status, loading, refresh };
}
