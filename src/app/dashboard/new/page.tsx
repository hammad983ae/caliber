"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ChatPanel, type ChatMessage } from "@/components/dashboard/chat-panel";
import { FlowPanel } from "@/components/dashboard/flow-panel";
import { ConfirmationModal } from "@/components/dashboard/confirmation-modal";
import { ToggleSwitch } from "@/components/dashboard/toggle-switch";
import { useAutomations } from "@/components/dashboard/automations-context";
import { respondTo } from "@/lib/mock-automation-builder";
import type { AutomationStatus, FlowStep } from "@/lib/automations";

const GREETING: ChatMessage = {
  role: "assistant",
  text: "What do you want to automate? Describe it however feels natural — I'll turn it into steps on the right.",
};

function guessName(steps: FlowStep[]) {
  const action = steps.find((s) => s.kind === "action");
  return action ? action.description : "New automation";
}

export default function NewAutomationPage() {
  const router = useRouter();
  const { organization } = useOrganization();
  const { user } = useUser();
  const { addAutomation } = useAutomations();
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [thinking, setThinking] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [shareWithTeam, setShareWithTeam] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setThinking(true);

    setTimeout(() => {
      const turn = respondTo(text, steps, turnIndex);
      setSteps(turn.steps);
      setMessages((prev) => [...prev, { role: "assistant", text: turn.reply }]);
      setThinking(false);
      setTurnIndex((i) => i + 1);
    }, 650);
  };

  const handleReset = () => {
    setMessages([GREETING]);
    setSteps([]);
    setTurnIndex(0);
    setShareWithTeam(false);
    setRequiresApproval(false);
  };

  const commitSave = async (alwaysAllow: boolean) => {
    const connectors = Array.from(new Set(steps.map((s) => s.icon)));
    const status: AutomationStatus =
      shareWithTeam && requiresApproval ? "pending_approval" : "active";

    setSaving(true);
    try {
      const automation = await addAutomation({
        name: guessName(steps),
        status,
        connectors,
        steps,
        alwaysAllow,
        createdBy: user
          ? { name: user.fullName ?? "You", imageUrl: user.imageUrl }
          : undefined,
      });
      router.push(`/dashboard?created=${automation.id}`);
    } catch {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    const hasConfirmRisk = steps.some((s) => s.risk === "confirm");
    if (hasConfirmRisk) {
      setConfirmOpen(true);
    } else {
      commitSave(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/10">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">New automation</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Nothing runs until you save it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="rounded-full bg-black/[.04] px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/[.1]"
          >
            Start over
          </button>
          <button
            onClick={handleSaveClick}
            disabled={steps.length === 0 || saving}
            className="rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-500/30 transition-transform disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none enabled:hover:scale-[1.03]"
          >
            {saving ? "Saving…" : "Save automation"}
          </button>
        </div>
      </div>

      {organization && (
        <div className="flex flex-wrap items-center gap-6 border-b border-black/5 px-6 py-3 dark:border-white/10">
          <label className="flex items-center gap-2.5 text-sm">
            <ToggleSwitch
              on={shareWithTeam}
              onChange={() => setShareWithTeam((v) => !v)}
              label="Share with team"
            />
            Share with {organization.name}
          </label>
          {shareWithTeam && (
            <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="h-4 w-4 rounded border-black/20 text-indigo-600 focus:ring-indigo-500 dark:border-white/20"
              />
              Require admin approval before it runs
            </label>
          )}
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 border-b border-black/5 lg:border-r lg:border-b-0 dark:border-white/10">
          <ChatPanel messages={messages} thinking={thinking} onSend={handleSend} />
        </div>
        <div className="min-h-0 overflow-y-auto p-6">
          <FlowPanel steps={steps} />
        </div>
      </div>

      {confirmOpen && (
        <ConfirmationModal
          automationName={guessName(steps)}
          steps={steps}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={(alwaysAllow) => {
            setConfirmOpen(false);
            commitSave(alwaysAllow);
          }}
        />
      )}
    </div>
  );
}
