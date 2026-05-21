import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "I Simpósio CBMAP · Combate a Incêndio Urbano · 2026",
  description:
    "I Simpósio Estadual de Combate a Incêndio Urbano · CBMAP · 24, 25 e 26 de junho de 2026 · Anfiteatro da UNIFAP, Macapá/AP.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
