import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { clearCookies, login } from "../utils";

context.only("Zones", () => {
  beforeEach(() => {
    login();
    cy.visit(generateNewURL("/zones"));
  });

  afterEach(() => {
    clearCookies();
  });

  it.only("renders the correct heading", () => {
    cy.get("[data-test='section-header-title']").contains("Availability zones");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/zones")
    );
  });
});
