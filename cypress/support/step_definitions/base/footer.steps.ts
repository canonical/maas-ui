import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

Given("the user is on the home page", () => {
  cy.visit(generateMAASURL("/"));
});

When("the user looks for the {string} link", (linkName: string) => {
  cy.findByRole("link", { name: new RegExp(linkName, "i") }).as("element");
});

Then("the link should include {string}", (expectedHref) => {
  cy.get("@element").should("have.attr", "href").and("include", expectedHref);
});
