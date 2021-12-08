import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Device listing", () => {
  beforeEach(() => {
    login();
    cy.visit(generateLegacyURL("/devices"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Devices");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateLegacyURL("/devices")
    );
  });
});
