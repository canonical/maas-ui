import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";

const legacyPages = ["/devices", "/controllers", "/networks"];

const newPages = [
  { title: "Devices", url: "/devices" },
  { title: "Controllers", url: "/controllers" },
  { title: "Subnets", url: "/networks" },
  { title: "Machines", url: "/machines" },
  { title: "KVM", url: "/kvm/lxd" },
  { title: "Images", url: "/images" },
  { title: "DNS", url: "/domains" },
  { title: "Availability zones", url: "/zones" },
  { title: "Settings", url: "/settings/configuration/general" },
  { title: "My preferences", url: "/account/prefs/details" },
];

beforeEach(() => {
  cy.login();
});

newPages.forEach((page) => {
  it(`${page.title} has no detectable accessibility violations`, () => {
    cy.viewport("macbook-13");
    const pageUrl = legacyPages.includes(page.url)
      ? generateLegacyURL(page.url)
      : generateNewURL(page.url);
    cy.visit(pageUrl);

    cy.waitUntil(
      () => Cypress.$("[data-testid='section-header-title-spinner']").length < 1
    );

    cy.get("h1").contains(page.title);

    cy.testA11y();

    // cy.findByRole("heading", { level: 1, name: page.title }).should("be.visible");
  });
});
