import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";

const legacyPages = ["/devices", "/controllers", "/networks"];

type Page = { h1?: string; h3?: string; url: string };
const pages: Page[] = [
  { h3: "SSH keys for admin", url: "intro/user" },
  { h1: "Devices", url: "/devices" },
  { h1: "Controllers", url: "/controllers" },
  { h1: "Subnets", url: "/networks" },
  { h1: "Machines", url: "/machines" },
  { h1: "KVM", url: "/kvm/lxd" },
  { h1: "Images", url: "/images" },
  { h1: "DNS", url: "/domains" },
  { h1: "Availability zones", url: "/zones" },
  { h1: "Settings", url: "/settings/configuration/general" },
  { h1: "My preferences", url: "/account/prefs/details" },
];

pages.forEach((page: Page) => {
  // fallback for pages that do not have an h1
  const title = page.h1 || page.h3 || "";
  const { url } = page;

  it(`"${title}" page has no detectable accessibility violations on load`, () => {
    if (page.url === "intro/user") {
      cy.login({ shouldSkipIntro: false });
    } else {
      cy.login();
    }

    cy.viewport("macbook-13");

    const pageUrl = legacyPages.includes(url)
      ? generateLegacyURL(url)
      : generateNewURL(url);
    cy.visit(pageUrl);

    cy.waitUntil(
      () => Cypress.$("[data-testid='section-header-title-spinner']").length < 1
    );

    if (title.length > 0) {
      cy.get(page.h1 ? "h1" : "h3").contains(title);
    }

    cy.testA11y({ url, title });

    // cy.findByRole("heading", { level: 1, name: page.title }).should("be.visible");
  });
});
