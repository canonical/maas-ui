import { When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

When("the user navigates to the network discovery page", () => {
  cy.visit(generateMAASURL("/network-discovery"));
});
