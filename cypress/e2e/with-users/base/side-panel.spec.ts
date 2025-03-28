import { generateMAASURL } from "../../utils";

context("Side panel", () => {
  beforeEach(() => {
    cy.login();
    cy.expandMainNavigation();
    cy.visit(generateMAASURL("/devices"));
    // open side panel
    cy.findByRole("button", { name: /Add device/i }).click();
  });

  it("closes the side panel on ESC key press", () => {
    cy.findByTestId("app-side-panel").should("be.visible");
    cy.findByRole("complementary", { name: "Add device" }).should("be.visible");
    cy.get("body").type("{esc}");
    cy.findByRole("complementary", { name: "Add device" }).should("not.exist");
    cy.findByTestId("app-side-panel").should("not.be.visible");
  });

  it("closes the side panel when navigating to a different page", () => {
    cy.findByTestId("app-side-panel").should("be.visible");
    cy.findByRole("heading", { name: "Add device" }).should("be.visible");
    cy.visit(generateMAASURL("/machines"));
    cy.findByTestId("app-side-panel", { timeout: 20000 }).should(
      "not.be.visible"
    );
    cy.waitForPageToLoad();
    cy.visit(generateMAASURL("/controllers"));
    cy.findByRole("button", { name: "Add rack controller" }).click();
    cy.findByRole("complementary", { name: "Add controller" }).should(
      "be.visible"
    );
    cy.getMainNavigation().within(() =>
      cy.findByRole("link", { name: "LXD" }).click()
    );
    cy.waitForPageToLoad();
    cy.findByRole("complementary", { name: "Add controller" }).should(
      "not.exist"
    );
  });
});
