import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OneWeekBrief — Decision-grade market research, fully cited, in 24-72 hours",
  description:
    "Submit a one-paragraph brief. A senior editor and an AI research engine deliver a fully-footnoted market research dossier in 24-72 hours. No consulting cycle. No paywalled report. No fabricated sources.",
  metadataBase: new URL("https://market-research-on-demand.prin7r.com"),
  openGraph: {
    title: "OneWeekBrief — Decision-grade market research, fully cited",
    description:
      "Decision-grade market research. Fully cited. In 24-72 hours.",
    type: "website",
    url: "https://market-research-on-demand.prin7r.com",
    siteName: "OneWeekBrief",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneWeekBrief — Decision-grade market research, fully cited",
    description:
      "Decision-grade market research. Fully cited. In 24-72 hours.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
