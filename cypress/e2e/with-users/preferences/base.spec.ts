import { generateMAASURL } from "../../utils";

context("User preferences", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/account/prefs"));
  });

  it("renders the correct heading", () => {
    cy.get(".p-side-navigation__title").contains("My preferences");
  });
});
