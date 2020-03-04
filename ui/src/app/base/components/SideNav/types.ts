export type Location = {
  pathname: string;
};

export type SubNav = {
  label: string;
  path: string;
};

export type SideNavSection = {
  label: string;
  path?: string;
  subNav?: SubNav[];
};

export type SideNavProps = { sectionList: SideNavSection[] };
