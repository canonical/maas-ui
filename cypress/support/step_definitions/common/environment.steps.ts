import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("the viewport is {string}", (viewport: Cypress.ViewportPreset) => {
  cy.viewport(viewport);
});

Given("the page is loaded", () => {
  cy.waitForPageToLoad();
});
