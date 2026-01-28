import { generateMAASURL } from "../../utils";

const settingsPages = [
  {
    path: "/settings/configuration/general",
    label: "General",
  },
  {
    path: "/settings/configuration/commissioning",
    label: "Commissioning",
  },
  {
    path: "/settings/configuration/deploy",
    label: "Deploy",
  },
  {
    path: "/settings/configuration/kernel-parameters",
    label: "Kernel parameters",
  },
  {
    path: "/settings/security/security-protocols",
    label: "Security protocols",
  },
  {
    path: "/settings/security/secret-storage",
    label: "Secret storage",
  },
  {
    path: "/settings/security/session-timeout",
    label: "Token expiration",
  },
  {
    path: "/settings/security/ipmi-settings",
    label: "IPMI settings",
  },
  {
    path: "/settings/user-management/users",
    label: "Users",
  },
  {
    path: "/settings/user-management/single-sign-on",
    label: "OIDC/Single sign-on",
  },
  {
    path: "/settings/images/ubuntu",
    label: "Ubuntu",
  },
  {
    path: "/settings/images/windows",
    label: "Windows",
  },
  {
    path: "/settings/images/vmware",
    label: "VMware",
  },
  {
    path: "/settings/license-keys",
    label: "License keys",
  },
  {
    path: "/settings/storage",
    label: "Storage",
  },
  {
    path: "/settings/network/proxy",
    label: "Proxy",
  },
  {
    path: "/settings/network/dns",
    label: "DNS",
  },
  {
    path: "/settings/network/ntp",
    label: "NTP",
  },
  {
    path: "/settings/network/syslog",
    label: "Syslog",
  },
  {
    path: "/settings/network/network-discovery",
    label: "Network discovery",
  },
  {
    path: "/settings/scripts/commissioning",
    label: "Commissioning scripts",
  },
  {
    path: "/settings/scripts/testing",
    label: "Testing scripts",
  },
  {
    path: "/settings/dhcp",
    label: "DHCP snippets",
  },
  {
    path: "/settings/repositories",
    label: "Package repositories",
  },
];

context("settings pages titles", () => {
  beforeEach(() => {
    cy.login();
  });

  settingsPages.forEach((page) => {
    it(`${page.label} page`, () => {
      cy.visit(generateMAASURL(page.path));
      cy.findByRole("heading", { name: page.label }).should("exist");
    });
  });
});
