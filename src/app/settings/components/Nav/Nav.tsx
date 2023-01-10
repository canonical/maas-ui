import SideNav from "app/base/components/SideNav";
import settingsURLs from "app/settings/urls";

export const Nav = (): JSX.Element => (
  <SideNav
    closeToggleText="Close settings menu"
    items={[
      {
        label: "Configuration",
        subNav: [
          { path: settingsURLs.configuration.general, label: "General" },
          {
            path: settingsURLs.configuration.commissioning,
            label: "Commissioning",
          },
          { path: settingsURLs.configuration.deploy, label: "Deploy" },
          {
            path: settingsURLs.configuration.kernelParameters,
            label: "Kernel parameters",
          },
        ],
      },
      {
        label: "Security",
        subNav: [
          {
            path: settingsURLs.security.securityProtocols,
            label: "Security protocols",
          },
          {
            path: settingsURLs.security.secretStorage,
            label: "Secret storage",
          },
          {
            path: settingsURLs.security.ipmiSettings,
            label: "IPMI settings",
          },
        ],
      },
      {
        path: settingsURLs.users.index,
        label: "Users",
      },
      {
        label: "Images",
        subNav: [
          { path: settingsURLs.images.ubuntu, label: "Ubuntu" },
          { path: settingsURLs.images.windows, label: "Windows" },
          { path: settingsURLs.images.vmware, label: "VMware" },
        ],
      },
      {
        path: settingsURLs.licenseKeys.index,
        label: "License keys",
      },
      {
        path: settingsURLs.storage,
        label: "Storage",
      },
      {
        label: "Network",
        subNav: [
          { path: settingsURLs.network.proxy, label: "Proxy" },
          { path: settingsURLs.network.dns, label: "DNS" },
          { path: settingsURLs.network.ntp, label: "NTP" },
          { path: settingsURLs.network.syslog, label: "Syslog" },
          {
            path: settingsURLs.network.networkDiscovery,
            label: "Network discovery",
          },
        ],
      },
      {
        label: "Scripts",
        subNav: [
          {
            path: settingsURLs.scripts.commissioning.index,
            label: "Commissioning scripts",
          },
          {
            path: settingsURLs.scripts.testing.index,
            label: "Testing scripts",
          },
        ],
      },
      {
        path: settingsURLs.dhcp.index,
        label: "DHCP snippets",
      },
      {
        path: settingsURLs.repositories.index,
        label: "Package repos",
      },
    ]}
    openToggleText="Settings menu"
  />
);

export default Nav;
