import { customAlphabet } from 'nanoid'

import { generateMac, login } from "./utils";

const nanoid = customAlphabet('1234567890abcdefghi', 10);
context("Machine listing", () => {
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 5000);
    login();
    cy.setCookie('skipintro', 'true');
    cy.visit(
      `${Cypress.env("BASENAME")}${Cypress.env("REACT_BASENAME")}/machines`
    );
  });

  it("renders a heading", () => {
    cy.get("li.p-heading--four").contains("Machines");
  });

  it("can add a machine", () => {
    const hostname = `cypress-${nanoid()}`;
    cy.visit(
      `${Cypress.env("BASENAME")}${Cypress.env("REACT_BASENAME")}/machines/add`
    );
    cy.get("input[name='hostname']").type(hostname);
    cy.get("input[name='pxe_mac']").type(generateMac());
    cy.get("select[name='power_type']").select("Manual").blur();
    cy.get("button[type='submit']").click();
    cy.get('p.p-notification__response').contains(`${hostname} added successfully.`);
  });
});
