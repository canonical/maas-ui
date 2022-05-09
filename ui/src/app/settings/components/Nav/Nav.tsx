import SideNav from "app/base/components/SideNav";
import settingsURLs from "app/settings/urls";

export const Nav = (): JSX.Element => (
  <SideNav
    closeToggleText="Close settings menu"
    items={[
      {
        label: "Configuration",
        subNav: [
          { label: "General", path: settingsURLs.configuration.general },
          {
            label: "Security",
            path: settingsURLs.configuration.security,
          },
          {
            label: "Commissioning",
            path: settingsURLs.configuration.commissioning,
          },
          { label: "Deploy", path: settingsURLs.configuration.deploy },
          {
            label: "Kernel parameters",
            path: settingsURLs.configuration.kernelParameters,
          },
        ],
      },
      {
        label: "Users",
        path: settingsURLs.users.index,
      },
      {
        label: "Images",
        subNav: [
          { label: "Ubuntu", path: settingsURLs.images.ubuntu },
          { label: "Windows", path: settingsURLs.images.windows },
          { label: "VMware", path: settingsURLs.images.vmware },
        ],
      },
      {
        label: "License keys",
        path: settingsURLs.licenseKeys.index,
      },
      {
        label: "Storage",
        path: settingsURLs.storage,
      },
      {
        label: "Network",
        subNav: [
          { label: "Proxy", path: settingsURLs.network.proxy },
          { label: "DNS", path: settingsURLs.network.dns },
          { label: "NTP", path: settingsURLs.network.ntp },
          { label: "Syslog", path: settingsURLs.network.syslog },
          {
            label: "Network discovery",
            path: settingsURLs.network.networkDiscovery,
          },
        ],
      },
      {
        label: "Scripts",
        subNav: [
          {
            label: "Commissioning scripts",
            path: settingsURLs.scripts.commissioning.index,
          },
          {
            label: "Testing scripts",
            path: settingsURLs.scripts.testing.index,
          },
        ],
      },
      {
        label: "DHCP snippets",
        path: settingsURLs.dhcp.index,
      },
      {
        label: "Package repos",
        path: settingsURLs.repositories.index,
      },
    ]}
    openToggleText="Settings menu"
  />
);

export default Nav;
