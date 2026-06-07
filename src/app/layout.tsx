import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { ReduxProvider } from "./providers/ReduxProvider";
import { ColorBends } from "@/shared/ui/backgrounds/ColorBends";
import { AppPreloader } from "@/shared/ui/loaders/AppPreloader";
import { AppToaster } from "@/shared/ui/toasts/AppToaster";
import "sileo/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mesa de ayuda TI",
  description: "Proyecto programacion 4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col overflow-x-hidden bg-white font-manrope">
        <div className="pointer-events-none fixed inset-0 z-0">
          <ColorBends
            colors={["#155dfc", "#155dfc", "#155dfc"]}
            rotation={90}
            speed={0.2}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={1}
            noise={0.15}
            parallax={0.5}
            iterations={1}
            intensity={1.5}
            bandWidth={6}
            transparent
            autoRotate={0}
          />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <ReduxProvider>
            <AppPreloader minDuration={500} />
            {children}
          </ReduxProvider>
        </div>
        <AppToaster />
      </body>
    </html>
  );
}
