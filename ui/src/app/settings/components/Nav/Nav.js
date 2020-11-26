import React from "react";

import SideNav from "app/base/components/SideNav";

export const Nav = () => (
  <SideNav
    items={[
      {
        label: "Configuration",
        subNav: [
          { path: "configuration/general", label: "General" },
          {
            path: "configuration/commissioning",
            label: "Commissioning",
          },
          { path: "configuration/deploy", label: "Deploy" },
          {
            path: "configuration/kernel-parameters",
            label: "Kernel parameters",
          },
        ],
      },
      {
        path: "users",
        label: "Users",
      },
      {
        label: "Images",
        subNav: [
          { path: "images/ubuntu", label: "Ubuntu" },
          { path: "images/windows", label: "Windows" },
          { path: "images/vmware", label: "VMware" },
        ],
      },
      {
        path: "license-keys",
        label: "License keys",
      },
      {
        path: "storage",
        label: "Storage",
      },
      {
        label: "Network",
        subNav: [
          { path: "network/proxy", label: "Proxy" },
          { path: "network/dns", label: "DNS" },
          { path: "network/ntp", label: "NTP" },
          { path: "network/syslog", label: "Syslog" },
          {
            path: "network/network-discovery",
            label: "Network discovery",
          },
        ],
      },
      {
        label: "Scripts",
        subNav: [
          {
            path: "scripts/commissioning",
            label: "Commissioning scripts",
          },
          { path: "scripts/testing", label: "Testing scripts" },
        ],
      },
      {
        path: "dhcp",
        label: "DHCP snippets",
      },
      {
        path: "repositories",
        label: "Package repos",
      },
    ]}
  />
);

export default Nav;
