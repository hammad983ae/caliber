import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AutomationsProvider } from "@/components/dashboard/automations-context";
import { ActivityProvider } from "@/components/dashboard/activity-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AutomationsProvider>
      <ActivityProvider>
        <div className="flex h-screen min-h-0 overflow-hidden">
          <Sidebar />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </ActivityProvider>
    </AutomationsProvider>
  );
}
