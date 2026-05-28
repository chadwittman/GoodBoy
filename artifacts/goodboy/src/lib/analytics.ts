declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "G-F8JQ5Y60K2").trim();

let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;
  if (!MEASUREMENT_ID) return;
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
  initialized = true;
}

export function trackPageView(path: string, title?: string): void {
  if (!MEASUREMENT_ID) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
    send_to: MEASUREMENT_ID,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!MEASUREMENT_ID) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, { ...(params ?? {}), send_to: MEASUREMENT_ID });
}

export const analyticsEnabled = Boolean(MEASUREMENT_ID);
