import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Zones", () => {
  beforeEach(() => {
    login();
    cy.visit(generateNewURL("/zones"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains(
      "Availability zones"
    );
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/zones")
    );
  });
});
