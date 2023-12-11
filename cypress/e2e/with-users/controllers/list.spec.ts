import { generateMAASURL } from "../../utils";

context("Controller listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/controllers"));
  });

  it("renders the correct heading", () => {
    cy.findByRole("heading", { level: 1 }).contains("Controllers");
  });
});
