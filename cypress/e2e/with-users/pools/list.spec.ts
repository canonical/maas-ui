import { generateMAASURL } from "../../utils";

context("Pools list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/pools"));
  });

  it("renders a heading", () => {
    cy.contains(/Resource pool/i);
    cy.findByLabelText(/Pool list/i);
  });
});
