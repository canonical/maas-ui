import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

Given("the user is logged in with intro enabled", () => {
  cy.login({
    shouldSkipIntro: false,
    shouldSkipSetupIntro: false,
  });
});

Given("the user navigates to the home page", () => {
  cy.visit(generateMAASURL("/"));
  cy.waitForPageToLoad();
});

When("the user saves the intro setup", () => {
  cy.findByRole("heading", { name: /Welcome to MAAS/i }).should("exist");
  cy.waitForPageToLoad();
  cy.findByRole("button", { name: /Save/i }).click();
});

When("the user skips the initial setup", () => {
  cy.findByRole("heading", { name: /Welcome to MAAS/i }).should("exist");
  cy.findByRole("button", { name: /Skip/i }).click();
  cy.findByText(
    /Are you sure you want to skip the initial MAAS setup?/i
  ).should("exist");
  cy.findByRole("button", { name: /Skip/i }).click();
});

Then("the intro page should be displayed", () => {
  cy.findByRole("heading", { name: /Welcome to MAAS/i }).should("exist");
  cy.location("pathname").should("eq", generateMAASURL("/intro"));
});

Then(
  "the user should be redirected to the intro {string} setup",
  (section: string) => {
    cy.location("pathname").should("eq", generateMAASURL(`/intro/${section}`));
  }
);
