import { generateMAASURL } from "../../utils";

context("Pools list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/pools"));
  });

  it("renders a heading", () => {
    cy.findByRole("heading", {
      name: /[0-9]+ machine[s]? in [0-9]+ pool[s]?/i,
    }).should("exist");
    cy.findByLabelText(/Pool list/i);
  });
});
