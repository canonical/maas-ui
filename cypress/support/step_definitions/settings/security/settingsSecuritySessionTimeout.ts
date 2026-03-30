import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("the user clears the {string} field", (fieldName: string) => {
  cy.findByRole("textbox", { name: fieldName }).clear();
});

When(
  "the user enters {string} into the {string} field",
  (value: string, fieldName: string) => {
    cy.findByRole("textbox", { name: fieldName }).type(value);
  }
);

When("the user saves the token expiration settings if possible", () => {
  cy.findByRole("button", { name: "Save" }).then(($button) => {
    if ($button.is(":disabled")) {
      return;
    }

    cy.wrap($button).click();
  });
});

Then("the login form should be displayed", () => {
  cy.findByRole("form", { name: "Login" }).should("exist");
});
