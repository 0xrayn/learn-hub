import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnHub — Kuasai Bitcoin dari Nol ke Pro",
  description: "Platform edukasi Bitcoin & Blockchain terlengkap dalam Bahasa Indonesia. Gratis selamanya.",
  keywords: ["bitcoin", "blockchain", "kripto", "edukasi", "indonesia"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="night" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
