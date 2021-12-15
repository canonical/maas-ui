import { BASENAME } from "@maas-ui/maas-ui-shared";

Cypress.Commands.add(
  "login",
  (username = Cypress.env("username"), password = Cypress.env("password")) => {
    cy.setCookie("skipsetupintro", "true");
    cy.setCookie("skipintro", "true");
    cy.request({
      method: "POST",
      url: `${BASENAME}/accounts/login/`,
      form: true,
      body: {
        username,
        password,
      },
    });
  }
);
