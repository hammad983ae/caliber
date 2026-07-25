import type { ConnectorId } from "@/lib/connector-registry";

export function AppLogo({ app, className }: { app: ConnectorId; className?: string }) {
  switch (app) {
    case "google_calendar":
      return (
        <svg viewBox="0 0 36 36" className={className}>
          <rect width="36" height="36" rx="8" fill="#fff" stroke="#e2e2e5" strokeWidth="1" />
          <rect x="4" y="3" width="3" height="7" rx="1.5" fill="#8ab4f8" />
          <rect x="29" y="3" width="3" height="7" rx="1.5" fill="#8ab4f8" />
          <path d="M6 6h24a2 2 0 0 1 2 2v3H4V8a2 2 0 0 1 2-2Z" fill="#1a73e8" />
          <rect x="4" y="11" width="28" height="20" rx="1" fill="#fff" stroke="#e2e2e5" strokeWidth="1" />
          <text
            x="18"
            y="27"
            fontSize="15"
            fontWeight="700"
            fill="#1a73e8"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
          >
            31
          </text>
        </svg>
      );
    case "google_sheets":
      return (
        <svg viewBox="0 0 36 36" className={className}>
          <rect width="36" height="36" rx="8" fill="#fff" stroke="#e2e2e5" strokeWidth="1" />
          <path d="M9 4h13l5 5v22a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" fill="#0F9D58" />
          <path d="M22 4v4a1 1 0 0 0 1 1h4" fill="#0b7a43" />
          <rect x="11.5" y="13" width="13" height="15" rx="1" fill="#fff" />
          <path
            d="M11.5 17.7h13M11.5 22.3h13M16.3 13v15M20.7 13v15"
            stroke="#0F9D58"
            strokeWidth="1.1"
          />
        </svg>
      );
    case "gmail":
      return (
        <svg viewBox="0 0 36 36" className={className}>
          <rect width="36" height="36" rx="8" fill="#fff" stroke="#e2e2e5" strokeWidth="1" />
          <rect x="4" y="10" width="28" height="17" rx="2" fill="#fff" stroke="#e2e2e5" strokeWidth="1" />
          <path d="M4 12v15h6V17.5z" fill="#EA4335" />
          <path d="M32 12v15h-6V17.5z" fill="#EA4335" />
          <path
            d="M4 12l14 10.5L32 12"
            fill="none"
            stroke="#EA4335"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "slack":
      return (
        <svg viewBox="0 0 36 36" className={className}>
          <rect width="36" height="36" rx="8" fill="#fff" stroke="#e2e2e5" strokeWidth="1" />
          <rect x="10" y="4" width="4" height="10" rx="2" fill="#36C5F0" />
          <rect x="4" y="10" width="10" height="4" rx="2" fill="#2EB67D" />
          <rect x="22" y="4" width="4" height="10" rx="2" fill="#2EB67D" />
          <rect x="22" y="10" width="10" height="4" rx="2" fill="#ECB22E" />
          <rect x="22" y="22" width="4" height="10" rx="2" fill="#E01E5A" />
          <rect x="22" y="22" width="10" height="4" rx="2" fill="#36C5F0" />
          <rect x="10" y="22" width="4" height="10" rx="2" fill="#ECB22E" />
          <rect x="4" y="22" width="10" height="4" rx="2" fill="#E01E5A" />
        </svg>
      );
    case "notion":
      return (
        <svg viewBox="0 0 36 36" className={className}>
          <rect width="36" height="36" rx="8" fill="#fff" stroke="#111" strokeWidth="1.5" />
          <text
            x="18"
            y="25"
            fontSize="20"
            fontWeight="800"
            fill="#111"
            textAnchor="middle"
            fontFamily="Georgia, serif"
          >
            N
          </text>
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 36 36" className={className}>
          <circle cx="18" cy="18" r="18" fill="#1DB954" />
          <path
            d="M9 15.5c5-1.5 11-1 15 1.2"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M9.5 20c4.2-1.2 9-.8 12.7 1.2"
            fill="none"
            stroke="#fff"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M10 24.2c3.4-.9 7-.6 10 1"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "philips_hue":
      return (
        <svg viewBox="0 0 36 36" className={className}>
          <defs>
            <linearGradient id="hue-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="8" fill="url(#hue-gradient)" />
          <path
            d="M13.5 20.5c0-2.8 1.9-4 1.9-6.5a4.6 4.6 0 1 1 9.2 0c0 2.5 1.9 3.7 1.9 6.5 0 2-1.4 3.1-2 4.1-.4.6-.6 1.1-.6 1.7v.6h-7.8v-.6c0-.6-.2-1.1-.6-1.7-.6-1-2-2.1-2-4.1Z"
            fill="#fff"
            fillOpacity="0.95"
          />
          <path
            d="M16.5 29h5M17.6 31.5h2.8"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
