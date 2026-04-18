import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnHub – Belajar Bitcoin dari Nol",
  description: "Platform edukasi Bitcoin terlengkap. Harga realtime, artikel, modul belajar, dan tools konversi BTC ke IDR.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="noise mesh-bg min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
