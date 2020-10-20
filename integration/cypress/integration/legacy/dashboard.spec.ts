import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Dashboard", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders the correct heading", () => {
    cy.visit(generateLegacyURL("/dashboard"));
    cy.get(".page-header__title").contains("Network discovery");
  });

  it("displays the discoveries tab by default", () => {
    cy.get(".p-table--network-discovery").should("exist");
  });

  it("can display the configuration tab", () => {
    cy.get(".p-tabs__item:contains(Configuration)").click();
    cy.get(".p-form__label:contains(Discovery enabled)").should("exist");
  });
});
