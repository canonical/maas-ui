import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("User preferences", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(generateNewURL("/account/prefs"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders the correct heading", () => {
    cy.get("h1.p-heading--four").contains("My preferences");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/account/prefs")
    );
  });
});
