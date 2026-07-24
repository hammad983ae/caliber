"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import { sessionTaskMessage } from "@/lib/session-task-message";

export default function SignUpContinuePage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);

  const finalize = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setNotice(sessionTaskMessage(session.currentTask.key));
          return;
        }
        const url = decorateUrl("/dashboard");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  const needsName =
    signUp.missingFields.includes("first_name") ||
    signUp.missingFields.includes("last_name");

  const handleSubmit = async (formData: FormData) => {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    const { error } = await signUp.update({ firstName, lastName });
    if (error) return;

    if (signUp.status === "complete") {
      await finalize();
    }
  };

  if (!needsName) {
    return (
      <AuthShell
        title="Almost there"
        subtitle="We need a bit more information to finish setting up your account."
        footer={
          <button
            onClick={() => router.push("/sign-up")}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Back to sign up
          </button>
        }
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Please contact support if this keeps happening.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Almost there"
      subtitle="Tell us your name to finish creating your account."
    >
      <form action={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="firstName"
          name="firstName"
          label="First name"
          required
          error={errors.fields.firstName?.message}
        />
        <Field
          id="lastName"
          name="lastName"
          label="Last name"
          required
          error={errors.fields.lastName?.message}
        />
        {(notice || errors.global?.[0]) && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {notice ?? errors.global?.[0]?.longMessage ?? errors.global?.[0]?.message}
          </p>
        )}

        <button
          type="submit"
          disabled={fetchStatus === "fetching"}
          className="mt-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          Continue
        </button>
      </form>
    </AuthShell>
  );
}
