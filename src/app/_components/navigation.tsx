"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SystemTime } from "./systemTime";

const navigationItems = [
  { href: "/", label: "Accueil", icon: "/icons/1-Icone Acceuil.png" },
  {
    href: "/installation",
    label: "Installation",
    icon: "/icons/2-Icone Installation.png",
  },
  { href: "/procede", label: "Procédé", icon: "/icons/3-Icone Procédé.png" },
  {
    href: "/historique",
    label: "Historique",
    icon: "/icons/4-Icone Historique.png",
  },
  { href: "/reglage", label: "Réglage", icon: "/icons/5-Icone réglage.png" },
  { href: "/alarme", label: "Alarme", icon: "/icons/6-Icone Alarme.png" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Left Sidebar */}
      <nav className="lg:bg-dark-grey hidden lg:flex lg:h-full lg:w-24 lg:flex-col lg:p-4 lg:text-white">
        <div className="flex h-full flex-col">
          {/* Navigation Items */}
          <div className="flex flex-1 flex-col justify-center space-y-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center rounded-lg p-4"
                >
                  <div
                    className={`h-8 w-8 transition-all ${
                      isActive ? "bg-yellow" : "bg-sage"
                    }`}
                    style={{
                      mask: `url('${item.icon}') no-repeat center`,
                      maskSize: "contain",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* System Time at Bottom */}
          <div className="border-grey mt-auto border-t pt-4">
            <SystemTime />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="bg-dark-grey border-grey fixed right-0 bottom-0 left-0 z-40 border-t text-white lg:hidden">
        <div className="flex items-center justify-center gap-4 py-3 sm:gap-6 md:gap-12">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center p-2"
              >
                <div
                  className={`h-7 w-7 transition-all ${
                    isActive ? "bg-yellow" : "bg-grey"
                  }`}
                  style={{
                    mask: `url('${item.icon}') no-repeat center`,
                    maskSize: "contain",
                  }}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
