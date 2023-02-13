import { generateMAASURL } from "../../utils";

context("Machine listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains(
      /machines in 1 pool/
    );
  });

  it("highlights the correct navigation link", () => {
    cy.get(".l-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/machines")
    );
  });

  it("can group machines by all supported keys", () => {
    const GROUP_BY_OPTIONS = [
      "No grouping",
      "Group by status",
      "Group by owner",
      "Group by resource pool",
      "Group by architecture",
      "Group by domain",
      "Group by parent",
      "Group by KVM",
      "Group by KVM type",
      "Group by power state",
      "Group by zone",
    ];
    const getGroupBySelect = () =>
      cy.findByRole("combobox", { name: "Group by" });
    getGroupBySelect().within(() => {
      cy.findAllByRole("option").should("have.length", GROUP_BY_OPTIONS.length);
    });
    GROUP_BY_OPTIONS.forEach((option) => {
      getGroupBySelect().select(option);
      cy.waitForTableToLoad({ name: "Machines" });
    });
  });

  it("can hide machine table columns", () => {
    const allHeadersCount = 11;
    cy.findAllByRole("columnheader").should("have.length", allHeadersCount);

    cy.findAllByRole("button", { name: "Columns" }).click();
    cy.findByLabelText("columns menu").within(() =>
      // eslint-disable-next-line cypress/no-force
      cy.findByRole("checkbox", { name: "Status" }).click({ force: true })
    );

    cy.findAllByRole("columnheader").should("have.length", allHeadersCount - 1);
    cy.findByRole("header", { name: "Status" }).should("not.exist");

    cy.reload();

    // verify that the hidden column is still hidden after refresh
    cy.findAllByRole("columnheader").should("have.length", allHeadersCount - 1);
    cy.findByRole("header", { name: "Status" }).should("not.exist");
  });
});
