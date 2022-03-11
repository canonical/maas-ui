import { generateNewURL } from "@maas-ui/maas-ui-shared";

type Page = { heading: string; url: string };
const pages: Page[] = [
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

pages.forEach(({ heading, url }: Page) => {
  it(`"${heading}" page has no detectable accessibility violations on load`, () => {
    if (url === "/intro/user") {
      cy.login({ shouldSkipIntro: false });
    } else if (url !== "/accounts/login") {
      cy.login();
    }

    const pageUrl = generateNewURL(url);

    cy.visit(pageUrl);

    cy.waitForPageToLoad();
    cy.get("[data-testid='section-header-title']").contains(heading);

    cy.testA11y({ url, title: heading });
  });
});
