export type Page = { heading: string; headingLevel?: number; url: string };
export const pages: Page[] = [
  { heading: "Login", url: "/login" },
  { heading: "SSH keys for admin", url: "/intro/user" },
  { heading: "Devices", url: "/devices" },
  { heading: "Controllers", url: "/controllers" },
  { heading: "Networks", url: "/networks" },
  { heading: "Machines", url: "/machines" },
  { heading: "LXD", url: "/kvm/lxd" },
  { heading: "Images", url: "/images" },
  { heading: "DNS", url: "/domains" },
  { heading: "Availability zones", url: "/zones" },
  {
    heading: "Settings",
    headingLevel: 2,
    url: "/settings/configuration/general",
  },
  { heading: "My preferences", headingLevel: 2, url: "/account/prefs/details" },
];
export const routes: Record<string, string> = {
  controllers: "/controllers",
  devices: "/devices",
  domains: "/domains",
  home: "/",
  images: "/images",
  "images setup": "/intro/images",
  kvm: "/kvm",
  "maas setup": "/intro",
  "machines list": "/machines",
  "network discovery": "/network-discovery",
  pools: "/pools",
  preferences: "/account/prefs",
  "user setup": "/intro/user",
  zones: "/zones",
};
// longer timeout that can be useful for slow commands
export const LONG_TIMEOUT = 30000;
