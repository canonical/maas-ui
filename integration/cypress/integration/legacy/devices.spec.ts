import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Device listing", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(generateLegacyURL("/devices"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders the correct heading", () => {
    cy.get("[data-test='section-header-title']").contains("Devices");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateLegacyURL("/devices")
    );
  });
});
