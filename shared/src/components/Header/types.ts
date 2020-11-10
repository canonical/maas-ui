import type { ReactNode } from "react";

export type NavItem = {
  adminOnly?: boolean;
  highlight?: string | string[];
  inHardwareMenu?: boolean;
  isLegacy?: boolean;
  label: string;
  url: string;
};

export type GenerateNavLink = (link: NavItem, linkClass?: string) => ReactNode;

export type ToggleVisible = (
  evt: React.MouseEvent,
  preventDefault?: boolean
) => void;
