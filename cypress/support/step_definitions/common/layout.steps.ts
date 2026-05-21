import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { LONG_TIMEOUT } from "../../../constants";

Then("the main toolbar heading should be {string}", (expectedHeading) => {
  cy.get("[data-testid='main-toolbar-heading']").should(
    "contain",
    expectedHeading
  );
});

Then("the side navigation title should be {string}", (expectedHeading) => {
  cy.get(".p-side-navigation__title").should("contain", expectedHeading);
});

Then("the heading should be {string}", (expectedHeading: string) => {
  cy.findByRole("heading", { level: 1 }).contains(expectedHeading);
});

Then("the heading matching {string} text should exist", (heading: string) => {
  cy.contains("h1, h2, h3, h4, h5, h6", new RegExp(heading, "i"), {
    timeout: LONG_TIMEOUT,
  }).should("exist");
});

Then("the {string} header should not exist", (headerName: string) => {
  cy.findByRole("header", { name: headerName }).should("not.exist");
});

Then("the text matching {string} should exist", (text: string) => {
  cy.findByText(new RegExp(text, "i")).should("exist");
});

Then("the side panel should not be visible", () => {
  cy.get("#aside-panel").should("not.be.visible");
});
