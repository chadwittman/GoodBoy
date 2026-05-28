import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoodBoy — The gifting agent who lives to please her.",
  description: "He knows exactly what she wants before she says it. Plans gifts, books tables, sends flowers. Powered by Robinhood Gold.",
  metadataBase: new URL("https://goodboy.gift"),
  openGraph: {
    title: "GoodBoy — The gifting agent who lives to please her.",
    description: "He knows exactly what she wants before she says it. Plans gifts, books tables, sends flowers. She can even drop hints.",
    type: "website",
    siteName: "GoodBoy",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoodBoy — The gifting agent who lives to please her.",
    description: "He knows exactly what she wants before she says it. Plans gifts, books tables, sends flowers. She can even drop hints.",
    site: "@goodboy_gift",
    creator: "@goodboy_gift",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-white antialiased">{children}</body>
    </html>
  );
}
