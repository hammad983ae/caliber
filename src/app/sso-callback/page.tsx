"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    const navigateToSignIn = () => {
      router.push("/sign-in");
    };

    const navigate = async ({
      session,
      decorateUrl,
    }: {
      session?: { currentTask?: { key?: string } };
      decorateUrl: (url: string) => string;
    }) => {
      if (session?.currentTask) {
        router.push(`/sign-in?task=${encodeURIComponent(session.currentTask.key ?? "")}`);
        return;
      }
      const url = decorateUrl("/dashboard");
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        router.push(url);
      }
    };

    const finalizeSignIn = () => signIn.finalize({ navigate });
    const finalizeSignUp = () => signUp.finalize({ navigate });

    (async () => {
      if (!clerk.loaded || hasRun.current) return;
      hasRun.current = true;

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if ((signIn.status as string) === "complete") {
          await finalizeSignIn();
          return;
        }
        return navigateToSignIn();
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every((f) => f.strategy === "enterprise_sso")
      ) {
        return navigateToSignIn();
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        return router.push("/sign-up/continue");
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password" ||
        signIn.status === "needs_client_trust"
      ) {
        return navigateToSignIn();
      }

      if (signIn.existingSession || signUp.existingSession) {
        const sessionId =
          signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId, navigate });
          return;
        }
      }

      // Nothing matched — fall back to the sign-in page rather than leaving the user stranded.
      navigateToSignIn();
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      {/* Required in case a sign-in transfers to a sign-up needing captcha verification */}
      <div id="clerk-captcha" />
    </div>
  );
}
