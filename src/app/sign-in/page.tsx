"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/auth/divider";
import { Field } from "@/components/auth/field";
import { Redirecting } from "@/components/auth/redirecting";
import { sessionTaskMessage } from "@/lib/session-task-message";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<string | null>(
    searchParams.get("task") ? sessionTaskMessage(searchParams.get("task") ?? undefined) : null,
  );

  useEffect(() => {
    if (isSignedIn) router.replace("/dashboard");
  }, [isSignedIn, router]);

  const finalize = async () => {
    await signIn.finalize({
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

  const handleSubmit = async (formData: FormData) => {
    setNotice(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.password({ identifier: email, password });
    if (error) return;

    if (signIn.status === "complete") {
      await finalize();
    } else {
      setNotice(
        "This account needs an extra verification step we don't support yet. Please contact support."
      );
    }
  };

  const handleGoogle = async () => {
    setNotice(null);
    await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/dashboard",
    });
  };

  if (signIn.status === "complete" || isSignedIn) return <Redirecting notice={notice} />;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep automating."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign up
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
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
            error={errors.fields.identifier?.message}
          />
          <Field
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            error={errors.fields.password?.message}
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
            Sign in
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
