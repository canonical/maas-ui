import { generateMAASURL } from "../../../utils";

context("Settings Deploy configuration", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/configuration/general"));
  });

  it("displays a live preview of a MAAS theme colour", () => {
    cy.findByRole("radio", { name: "Red" }).click();

    cy.findByRole("banner").should("have.class", "p-navigation--red");
  });
});
