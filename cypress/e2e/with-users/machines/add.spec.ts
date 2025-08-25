import { customAlphabet } from "nanoid";

import { generateMAASURL, generateMac } from "../../utils";

const nanoid = customAlphabet("1234567890abcdefghi", 10);

context("Machine add", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
    cy.findByRole("button", { name: "Add hardware" }).click();
    cy.get(".p-contextual-menu__link").contains("Machine").click();
  });

  it("can add a machine", () => {
    const hostname = `cypress-${nanoid()}`;
    cy.get("input[name='hostname']").type(hostname);
    cy.get("input[name='pxe_mac']").type(generateMac());
    cy.get("select[name='power_type']").select("manual");
    cy.get("select[name='power_type']").blur();
    cy.get("button[type='submit']").click();
    cy.get("#aside-panel").should("not.be.visible");
  });

  it("closes the side panel on ESC key press", () => {
    cy.findByRole("heading", { name: "Add machine" }).should("be.visible");
    cy.get("body").type("{esc}");
    cy.findByRole("heading", { name: "Add machine" }).should("not.exist");
  });
});
