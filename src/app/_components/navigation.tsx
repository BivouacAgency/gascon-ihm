"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SystemTime } from "./systemTime";

// Placeholder icon component
const PlaceholderIcon = ({ className = "" }: { className?: string }) => (
  <div className={`h-6 w-6 rounded-sm bg-current ${className}`} />
);

const navigationItems = [
  { href: "/", label: "Accueil", icon: PlaceholderIcon },
  { href: "/installation", label: "Installation", icon: PlaceholderIcon },
  { href: "/procede", label: "Procédé", icon: PlaceholderIcon },
  { href: "/historique", label: "Historique", icon: PlaceholderIcon },
  { href: "/reglage", label: "Réglage", icon: PlaceholderIcon },
  { href: "/alarme", label: "Alarme", icon: PlaceholderIcon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Left Sidebar */}
      <nav className="lg:bg-dark-grey hidden lg:fixed lg:top-0 lg:left-0 lg:z-40 lg:flex lg:h-full lg:w-64 lg:flex-col lg:p-4 lg:text-white">
        <div className="flex h-full flex-col">
          <div className="mb-8 text-center text-xl font-bold">Gascon IHM</div>

          {/* Navigation Items */}
          <div className="flex flex-1 flex-col space-y-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* System Time at Bottom */}
          <div className="mt-auto border-t border-gray-600 pt-4">
            <SystemTime />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="bg-dark-grey fixed right-0 bottom-0 left-0 z-40 border-t border-gray-600 text-white lg:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center p-2 transition-colors ${
                  isActive ? "text-blue-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="mb-1" />
                <span className="truncate text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
