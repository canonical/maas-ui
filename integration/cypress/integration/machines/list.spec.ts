import { makeUIURL, login } from "../utils";

context("Machine listing", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(makeUIURL("/machines"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders a heading", () => {
    cy.get("li.p-heading--four").contains("Machines");
  });
});
