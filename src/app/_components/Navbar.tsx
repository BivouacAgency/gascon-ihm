"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC } from "react";
import { HomeIcon } from "./icons/HomeIcon";
import { InstallationIcon } from "./icons/InstallationIcon";
import { ProcedeIcon } from "./icons/ProcedeIcon";
import { HistoriqueIcon } from "./icons/HistoriqueIcon";
import { ReglageIcon } from "./icons/ReglageIcon";
import { AlarmeIcon } from "./icons/AlarmeIcon";
import { NavbarItem } from "./NavbarItem";
import { SystemTime } from "./systemTime";

const navbarItems = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  {
    href: "/installation",
    label: "Installation",
    icon: InstallationIcon,
  },
  { href: "/procede", label: "Procédé", icon: ProcedeIcon },
  {
    href: "/historique",
    label: "Historique",
    icon: HistoriqueIcon,
  },
  { href: "/reglage", label: "Réglage", icon: ReglageIcon },
  { href: "/alarme", label: "Alarme", icon: AlarmeIcon },
];

export const Navbar: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-dark-grey border-grey fixed right-0 bottom-0 left-0 z-40 flex border-t p-3 text-white lg:static lg:h-full lg:w-24 lg:flex-col lg:border-t-0 lg:border-r lg:p-4">
      <div className="flex flex-1 flex-row items-center justify-center gap-4 md:gap-8 lg:flex-1 lg:flex-col lg:justify-center lg:gap-4">
        {navbarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center rounded-lg p-2 lg:flex-row lg:p-4"
            >
              <NavbarItem
                isActive={isActive}
                IconComponent={item.icon}
                size={28}
              />
            </Link>
          );
        })}
      </div>

      <div className="border-grey mt-auto hidden border-t pt-4 lg:block">
        <SystemTime />
      </div>
    </nav>
  );
};
