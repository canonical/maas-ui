import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import type { LicenseKeys } from "app/store/licensekeys/types";
import type { PackageRepository } from "app/store/packagerepository/types";
import type { User } from "app/store/user/types";
import { argPath } from "app/utils";

const urls = {
  index: "/settings",
  configuration: {
    commissioning: "/settings/configuration/commissioning",
    deploy: "/settings/configuration/deploy",
    general: "/settings/configuration/general",
    index: "/settings/configuration",
    kernelParameters: "/settings/configuration/kernel-parameters",
    security: "/settings/configuration/security",
  },
  dhcp: {
    add: "/settings/dhcp/add",
    edit: argPath<{ id: DHCPSnippet["id"] }>("/settings/dhcp/:id/edit"),
    index: "/settings/dhcp",
  },
  images: {
    ubuntu: "/settings/images/ubuntu",
    vmware: "/settings/images/vmware",
    windows: "/settings/images/windows",
  },
  licenseKeys: {
    add: "/settings/license-keys/add",
    edit: argPath<{
      osystem: LicenseKeys["osystem"];
      distro_series: LicenseKeys["distro_series"];
    }>("/settings/license-keys/:osystem/:distro_series/edit"),
    index: "/settings/license-keys",
  },
  network: {
    dns: "/settings/network/dns",
    index: "/settings/network",
    networkDiscovery: "/settings/network/network-discovery",
    ntp: "/settings/network/ntp",
    proxy: "/settings/network/proxy",
    syslog: "/settings/network/syslog",
  },
  repositories: {
    index: "/settings/repositories",
    add: argPath<{ type: "repository" | "ppa" }>(
      "/settings/repositories/add/:type"
    ),
    edit: argPath<{ id: PackageRepository["id"]; type: "repository" | "ppa" }>(
      "/settings/repositories/edit/:type/:id"
    ),
  },
  scripts: {
    commissioning: {
      index: "/settings/scripts/commissioning",
      upload: "/settings/scripts/commissioning/upload",
    },
    testing: {
      index: "/settings/scripts/testing",
      upload: "/settings/scripts/testing/upload",
    },
  },
  storage: "/settings/storage",
  users: {
    add: "/settings/users/add",
    edit: argPath<{ id: User["id"] }>("/settings/users/:id/edit"),
    index: "/settings/users",
  },
};

export default urls;
