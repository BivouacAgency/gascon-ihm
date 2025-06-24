import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { Navigation } from "@/app/_components/navigation";

export const metadata: Metadata = {
  title: "Gascon IHM",
  description: "Interface for Gascon ESP32 Communication",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-grey min-h-screen">
        <TRPCReactProvider>
          <div className="flex h-screen">
            <Navigation />

            <main className="mb-16 flex-1 overflow-auto lg:mr-0 lg:mb-0 lg:ml-64">
              <div className="h-full">{children}</div>
            </main>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
