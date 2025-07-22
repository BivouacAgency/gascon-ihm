import { cn } from "@/lib/utils";
import React, { type FC } from "react";
import type { IconProps } from "./icons";

export interface NavbarItemProps {
  className?: string;
  isActive: boolean;
  IconComponent: FC<IconProps>;
  size?: number;
}

export const NavbarItem: FC<NavbarItemProps> = ({
  className,
  isActive,
  IconComponent,
  size = 32,
}) => {
  return (
    <div
      className={cn(
        isActive ? "text-yellow" : "text-sage",
        "transition-all",
        className,
      )}
    >
      <IconComponent width={size} height={size} />
    </div>
  );
};
