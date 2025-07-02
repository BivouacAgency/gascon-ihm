import "@/styles/globals.css";

import { type Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { Navigation } from "./_components/Navigation";

export const metadata: Metadata = {
  title: "Gascon IHM",
  description: "Interface for Gascon ESP32 Communication",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${openSans.variable}`}>
      <body className="bg-grey min-h-screen">
        <TRPCReactProvider>
          <div className="flex h-screen">
            {/* Desktop Layout */}
            <div className="hidden lg:flex lg:h-full lg:w-full">
              <Navigation />
              <main className="flex-1 overflow-auto">
                <div className="h-full">{children}</div>
              </main>
            </div>

            {/* Mobile Layout */}
            <div className="flex h-full w-full lg:hidden">
              <main className="mb-16 flex-1 overflow-auto">
                <div className="h-full">{children}</div>
              </main>
              <Navigation />
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
