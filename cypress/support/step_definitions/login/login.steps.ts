import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("the main navigation is expanded", () => {
  cy.expandMainNavigation();
});

Given("the user sets cookie to skip setup intro", () => {
  cy.setCookie("skipsetupintro", "true");
});

Given("the user sets cookies to skip setup and user intros", () => {
  cy.setCookie("skipsetupintro", "true");
  cy.setCookie("skipintro", "true");
});

When("the user enters invalid username and password", () => {
  cy.findByRole("textbox", { name: /Username/ }).type("invalid-username");
  cy.findByRole("button", { name: /Next/ }).click();
  cy.findByLabelText(/Password/).type("invalid-password{enter}");
});

When("the user provides correct username and password", () => {
  cy.get("input[name='username']").type(Cypress.env("username"));
  cy.findByRole("button", { name: /Next/ }).click();
  cy.get("input[name='password']").type(Cypress.env("password"));
  cy.get("button[type='submit']").click();
});

Then("the text {string} should be visible", (text: string) => {
  cy.findByRole("alert").should("be.visible").should("include.text", text);
});
