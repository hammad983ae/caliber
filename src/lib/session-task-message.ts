type SessionTaskKey = "choose-organization" | "reset-password" | "setup-mfa";

// We don't have UI for any of these yet (no organizations/teams feature,
// no custom password-reset or MFA flow), so a pending task is always a
// dead end today. Surface it clearly instead of silently stalling.
export function sessionTaskMessage(key: SessionTaskKey | string | undefined): string {
  switch (key) {
    case "choose-organization":
      return "Your account needs an organization selected before continuing, and that isn't set up in this app yet. Please contact support.";
    case "reset-password":
      return "Your password needs to be reset before continuing. Check your email for instructions, or contact support.";
    case "setup-mfa":
      return "Your account requires additional security setup we don't support here yet. Please contact support.";
    default:
      return "Your account needs one more setup step that isn't available yet. Please contact support.";
  }
}
