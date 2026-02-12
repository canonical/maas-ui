import { When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

When("the user navigates to the kvm page", () => {
  cy.visit(generateMAASURL("/kvm"));
});
