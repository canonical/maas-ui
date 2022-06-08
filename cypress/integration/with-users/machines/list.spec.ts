import { generateMAASURL } from "../../utils";

context("Machine listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Machines");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/machines")
    );
  });

  it.skip("can hide machine table columns", () => {
    cy.findAllByRole("columnheader").should("have.length", 8);

    cy.findAllByRole("button", { name: "Hidden columns" }).click();
    cy.findByLabelText("hidden columns menu").within(() =>
      // eslint-disable-next-line cypress/no-force
      cy.findByRole("checkbox", { name: "Status" }).click({ force: true })
    );

    cy.findAllByRole("columnheader").should("have.length", 7);
    cy.findByRole("header", { name: "Status" }).should("not.exist");

    cy.reload();

    // verify that the hidden column is still hidden after refresh
    cy.findAllByRole("columnheader").should("have.length", 7);
    cy.findByRole("header", { name: "Status" }).should("not.exist");
  });
});
