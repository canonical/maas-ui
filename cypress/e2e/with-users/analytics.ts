import { generateMAASURL } from "../utils";

context("Google Analytics", () => {
  beforeEach(function () {
    const ga = cy.stub().as("ga");
    cy.intercept({ hostname: "www.google-analytics.com" }, { statusCode: 503 });
    Cypress.on("window:before:load", (win) => {
      Object.defineProperty(win, "ga", {
        configurable: false,
        get: () => ga,
        set: () => {},
      });
    });
    cy.login();
  });

  it("window.ga is called correctly", function () {
    cy.visit(generateMAASURL("/machines"));
    cy.get("@ga")
      // ensure GA was created with our google analytics ID
      .should("be.calledWith", "create", "UA-1018242-63")
      // ensure that the initial pageview is sent
      .and("be.calledWith", "send", "pageview", "/MAAS/r/machines");

    cy.visit(generateMAASURL("/devices"));
    cy.get("@ga").and("be.calledWith", "send", "pageview", "/MAAS/r/devices");
  });
});
