export type Page = { heading: string; url: string };
export const pages: Page[] = [
  { heading: "Login", url: "/accounts/login" },
  { heading: "SSH keys for admin", url: "/intro/user" },
  { heading: "Devices", url: "/devices" },
  { heading: "Controllers", url: "/controllers" },
  { heading: "Subnets", url: "/networks" },
  { heading: "Machines", url: "/machines" },
  { heading: "KVM", url: "/kvm/lxd" },
  { heading: "Images", url: "/images" },
  { heading: "DNS", url: "/domains" },
  { heading: "Availability zones", url: "/zones" },
  { heading: "Settings", url: "/settings/configuration/general" },
  { heading: "My preferences", url: "/account/prefs/details" },
];
