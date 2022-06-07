import { generateMAASURL } from "../../../utils";

declare global {
  interface Window {
    usabilla_live: (type: string, trigger: string) => void;
    lightningjs: () => void;
  }
}

context("Footer", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/"));
  });

  it("navigates to the local documentation", () => {
    cy.get(".p-footer__link:contains(Local documentation)").click();
    cy.location("pathname").should("eq", "/MAAS/docs/");
  });

  it("has a link to legal", () => {
    cy.get(".p-footer__link:contains(Legal information)")
      .should("have.attr", "href")
      .and("include", "https://www.ubuntu.com/legal");
  });

  it("displays the feedback link", () => {
    cy.get(".p-footer__nav a:contains(Give feedback)").should("exist");
  });
});
