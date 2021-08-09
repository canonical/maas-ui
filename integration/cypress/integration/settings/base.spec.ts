import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { clearCookies, login } from "../utils";

context("Settings", () => {
  beforeEach(() => {
    login();
    cy.visit(generateNewURL("/settings"));
  });

  afterEach(() => {
    clearCookies();
  });

  it("renders the correct heading", () => {
    cy.get("h1.p-heading--four").contains("Settings");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/settings")
    );
  });
});
