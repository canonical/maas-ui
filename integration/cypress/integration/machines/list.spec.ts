import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Machine listing", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(generateNewURL("/machines"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders a heading", () => {
    cy.get("li.p-heading--four").contains("Machines");
  });
});
