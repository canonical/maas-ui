import { generateMAASURL } from "../../utils";

context("Side panel", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/devices"));
    // open side panel
    cy.findByRole("button", { name: /Add device/i }).click();
  });

  it("closes the side panel on ESC key press", () => {
    cy.findByRole("heading", { name: "Add device" }).should("be.visible");
    cy.get("body").type("{esc}");
    cy.findByRole("heading", { name: "Add device" }).should("not.exist");
  });

  it("closes the side panel when navigating to a different page", () => {
    cy.findByRole("heading", { name: "Add device" }).should("be.visible");
    cy.visit(generateMAASURL("/machines"));
    cy.findByRole("heading", { name: "Add device" }).should("not.exist");
  });
});
