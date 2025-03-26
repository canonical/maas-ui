import { generateMAASURL } from "../../utils";

context("Pools list", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept("GET", "/api/pools", { fixture: "pools.json" }).as("getPools");
    cy.visit(generateMAASURL("/pools"));
    cy.wait("@getPools");
  });

  it("renders a heading", () => {
    cy.findByRole("heading", {
      name: /[0-9]+ machine[s]? in [0-9]+ pool[s]?/i,
      timeout: 20000,
    }).should("exist");
    cy.findByLabelText(/Pool list/i);
  });
});
