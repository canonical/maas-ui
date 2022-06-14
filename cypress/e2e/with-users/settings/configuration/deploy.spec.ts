import { generateMAASURL } from "../../../utils";

context("Settings Deploy configuration", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/configuration/deploy"));
  });

  it("displays a correct default value for hardware sync interval", () => {
    // displays the deploy configuration form
    cy.findByRole("form", { name: /deploy configuration/i }).should("exist");

    cy.findByRole("textbox", {
      name: /Default hardware sync interval/,
    })
      // displays a correct default value
      .should("have.value", "15");
  });
});
