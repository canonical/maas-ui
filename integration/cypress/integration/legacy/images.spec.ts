import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Images", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(generateLegacyURL("/images"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders the correct heading", () => {
    cy.get("[data-test='section-header-title']").contains("Images");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateLegacyURL("/images")
    );
  });
});
