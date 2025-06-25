import { generateMAASURL } from "../../../utils";

context("Settings - Security - Session timeout", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/security/session-timeout"));
  });

  it("logs the user out when the session timeout expiration is changed", () => {
    cy.findByRole("textbox", { name: "Session timeout expiration" }).clear();
    cy.findByRole("textbox", { name: "Session timeout expiration" }).type(
      "13 days"
    );
    cy.findByRole("button", { name: "Save" }).then(($btn) => {
      if ($btn.is(":disabled")) {
        return;
      } else {
        cy.wrap($btn).click();
      }
    });
    cy.findByRole("form", { name: "Login" }).should("exist");
    cy.findByText(/Your session has expired/i).should("exist");
  });
});
