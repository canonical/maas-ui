import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Machine listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/machines"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Machines");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/machines")
    );
  });

  it("can hide machine table columns", () => {
    cy.findAllByRole("columnheader").should("have.length", 8);

    cy.findAllByRole("button", { name: "Hidden columns" }).click();
    cy.findByLabelText("hidden columns menu").within(() =>
      cy.findByRole("checkbox", { name: "status" }).click({ force: true })
    );

    cy.findAllByRole("columnheader").should("have.length", 7);
    cy.findByRole("header", { name: "status" }).should("not.exist");

    cy.reload();

    // verify that the hidden column is still hidden after refresh
    cy.findAllByRole("columnheader").should("have.length", 7);
    cy.findByRole("header", { name: "status" }).should("not.exist");
  });
});
