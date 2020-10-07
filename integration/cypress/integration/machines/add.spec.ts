import { customAlphabet } from "nanoid";

import { generateMac, makeUIURL, login } from "../utils";

const nanoid = customAlphabet("1234567890abcdefghi", 10);

context("Machine add", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(makeUIURL("/machines/add"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("can add a machine", () => {
    const hostname = `cypress-${nanoid()}`;
    cy.get("input[name='hostname']").type(hostname);
    cy.get("input[name='pxe_mac']").type(generateMac());
    cy.get("select[name='power_type']").select("manual").blur();
    cy.get("button[type='submit']").click();
    cy.get(`[data-test='message']:contains(${hostname} added successfully.)`);
  });
});
