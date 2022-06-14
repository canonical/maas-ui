import { generateMAASURL } from "../../utils";

context("Pools list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/pools"));
  });

  it("renders a heading", () => {
    cy.contains("1 Resource pool");
  });
});
