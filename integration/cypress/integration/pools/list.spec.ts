import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Pools list", () => {
  beforeEach(() => {
    login();
    cy.visit(generateNewURL("/pools"));
  });

  it("renders a heading", () => {
    cy.contains("1 Resource pool");
  });
});
