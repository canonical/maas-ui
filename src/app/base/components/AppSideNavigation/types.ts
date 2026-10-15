import type { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

export type NavItem = {
  adminOnly?: boolean;
  highlight?: string[] | string;
  icon?: string;
  label: string;
  requiredEntitlements?: Entitlement[];
  url: string;
};

export type NavGroup = {
  navLinks: NavItem[];
  groupTitle?: string;
  groupIcon?: string;
  isExpandable?: boolean;
};
