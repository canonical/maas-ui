import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../../utils";

context("Settings - User list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/settings/users"));
  });

  it("the side nav highlights correctly", () => {
    const navItem = ".p-side-navigation__link.is-active";
    cy.get(navItem).should("exist");
    cy.get(navItem).contains("Users");
  });
});
