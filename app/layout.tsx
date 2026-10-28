import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/montserrat/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aragon — Agencia de software a medida",
  description:
    "Aplicaciones web y móviles, software a medida, ERP, IA y automatización, diseñados y construidos por un solo equipo senior.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
