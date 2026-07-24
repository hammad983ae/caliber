"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/auth/divider";
import { Field } from "@/components/auth/field";

function formatTemplate(slug: string) {
  return slug
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<string | null>(null);

  const intent = searchParams.get("intent");
  const template = searchParams.get("template");

  useEffect(() => {
    if (isSignedIn) router.replace("/dashboard");
  }, [isSignedIn, router]);

  const finalize = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/dashboard");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  const handleSubmit = async (formData: FormData) => {
    setNotice(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;

    if (signUp.status === "complete") {
      await finalize();
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async (formData: FormData) => {
    setNotice(null);
    const code = formData.get("code") as string;

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await finalize();
    }
  };

  const handleGoogle = async () => {
    setNotice(null);
    await signUp.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/dashboard",
    });
  };

  if (signUp.status === "complete" || isSignedIn) return null;

  const awaitingVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (awaitingVerification) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`We sent a verification code to ${signUp.emailAddress ?? "your email"}.`}
        footer={
          <button
            onClick={() => signUp.reset()}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Use a different email
          </button>
        }
      >
        <form action={handleVerify} className="flex flex-col gap-4">
          <Field
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            label="Verification code"
            required
            error={errors.fields.code?.message}
          />

          {(notice || errors.global?.[0]) && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {notice ?? errors.global?.[0]?.longMessage ?? errors.global?.[0]?.message}
            </p>
          )}

          <button
            type="submit"
            disabled={fetchStatus === "fetching"}
            className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
          >
            Verify
          </button>

          <button
            type="button"
            onClick={() => signUp.verifications.sendEmailCode()}
            className="text-sm text-zinc-500 hover:text-foreground dark:text-zinc-400"
          >
            Resend code
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start turning what you say into automation."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {(intent || template) && (
          <div className="rounded-xl bg-indigo-500/10 px-4 py-3 text-sm text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">
            {intent ? (
              <>Continuing with: &ldquo;{intent}&rdquo;</>
            ) : (
              <>Starting from the &ldquo;{formatTemplate(template!)}&rdquo; template.</>
            )}
          </div>
        )}

        <GoogleButton onClick={handleGoogle} loading={fetchStatus === "fetching"} />

        <Divider label="or continue with email" />

        <form action={handleSubmit} className="flex flex-col gap-4">
          <Field
            id="email"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            error={errors.fields.emailAddress?.message}
          />
          <Field
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            required
            error={errors.fields.password?.message}
          />

          {(notice || errors.global?.[0]) && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {notice ?? errors.global?.[0]?.longMessage ?? errors.global?.[0]?.message}
            </p>
          )}

          {/* Required if Clerk's bot sign-up protection is enabled */}
          <div id="clerk-captcha" />

          <button
            type="submit"
            disabled={fetchStatus === "fetching"}
            className="mt-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
          >
            Create account
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
