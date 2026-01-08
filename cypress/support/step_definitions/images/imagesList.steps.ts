import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

When("the user navigates to the images page", () => {
  cy.visit(generateMAASURL("/images"));
});

Then("the main toolbar heading should be {string}", (expectedHeading) => {
  cy.get("[data-testid='main-toolbar-heading']").should(
    "contain",
    expectedHeading
  );
});
