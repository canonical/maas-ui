import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Pools list", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(generateNewURL("/pools"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders a heading", () => {
    cy.contains("1 Resource pool");
  });
});
