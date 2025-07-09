import { cn } from "@/lib/utils";
import React, { type FC } from "react";

export interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

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
