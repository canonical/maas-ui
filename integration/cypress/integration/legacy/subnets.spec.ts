import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Subnets", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(generateLegacyURL("/networks?by=fabric"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders the correct heading", () => {
    cy.get(".page-header__title").contains("Subnets");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateLegacyURL("/networks?by=fabric")
    );
  });
});
