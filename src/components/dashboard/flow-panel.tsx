import type { FlowStep, StepRisk } from "@/lib/automations";
import { ConnectorIcon } from "@/components/icons/connector-icon";

const riskStyles: Record<StepRisk, { label: string; className: string }> = {
  "read-only": {
    label: "Read-only",
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  reversible: {
    label: "Reversible",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  confirm: {
    label: "Needs confirmation",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
};

const kindLabel: Record<FlowStep["kind"], string> = {
  trigger: "Trigger",
  condition: "Condition",
  action: "Action",
};

const kindGradient: Record<FlowStep["kind"], string> = {
  trigger: "from-indigo-500 to-violet-500",
  condition: "from-sky-500 to-indigo-500",
  action: "from-violet-500 to-fuchsia-500",
};

function Connector() {
  return (
    <div className="flex justify-start pl-[22px]">
      <div className="h-6 w-px bg-gradient-to-b from-indigo-300 to-violet-300 dark:from-indigo-700 dark:to-violet-700" />
    </div>
  );
}

export function FlowPanel({ steps }: { steps: FlowStep[] }) {
  if (steps.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white/50 p-10 text-center ring-1 ring-black/5 dark:bg-white/[0.02] dark:ring-white/10">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your automation will take shape here as you describe it in the
          chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={`${step.icon}-${step.description}-${i}`}>
          {i > 0 && <Connector />}
          <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm ${kindGradient[step.kind]}`}
            >
              <ConnectorIcon icon={step.icon} className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
                  {kindLabel[step.kind]} {step.kind === "action" ? i : ""}
                </span>
                {step.risk && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${riskStyles[step.risk].className}`}
                  >
                    {riskStyles[step.risk].label}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
