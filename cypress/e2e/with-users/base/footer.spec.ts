import { generateMAASURL } from "../../utils";

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
    cy.findByRole("link", { name: /local documentation/i })
      .should("have.attr", "href")
      .and("include", "/MAAS/docs/");
  });

  it("has a link to legal", () => {
    cy.findByRole("link", {
      name: /legal information/i,
    })
      .should("have.attr", "href")
      .and("include", "https://www.ubuntu.com/legal");
  });
});
