import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { clearCookies, login } from "../utils";

context("User preferences", () => {
  beforeEach(() => {
    login();
    cy.visit(generateNewURL("/account/prefs"));
  });

  afterEach(() => {
    clearCookies();
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("My preferences");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/account/prefs")
    );
  });
});
