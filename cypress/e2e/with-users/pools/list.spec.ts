import { generateMAASURL } from "../../utils";

context("Pools list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/pools"));
  });

  it("renders a heading", () => {
    cy.contains(/machines in 1 pool/i);
    cy.findByLabelText(/Pool list/i);
  });
});
