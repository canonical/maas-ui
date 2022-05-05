import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Controller listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/controllers"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Controllers");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/controllers")
    );
  });

  it("can add a tag to the controller", () => {
    // displays the controller details page on click of the controller name
    cy.findByRole("gridcell", { name: "Name" }).within(() => {
      cy.findByRole("link").click();
    });

    cy.findByText(/Controller summary/).should("exist");

    // can add a tag to the controller
    cy.findByRole("tab", {
      name: /Configuration/,
    }).click();
    cy.findAllByRole("button", {
      name: /Edit/,
    })
      .first()
      .click();
    cy.get("input[placeholder='Add a tag']").type("test-tag");
    cy.findByRole("button", { name: /Save changes/ }).click();

    cy.findByRole("tab", { name: /Controller summary/ }).click();
    cy.findByRole("link", { name: "new-tag" }).should("exist");

    // displays the controller listing page filtered by tag on click of the tag name
    cy.findByRole("link", { name: "new-tag" }).click();

    // displays the correct tag in the searchbox
    cy.findByRole("searchbox", { name: /Search/ }).should(
      "have.value",
      "tag:(new-tag)"
    );

    // displays the correct number of controllers
    cy.findByRole("grid", { name: "controllers list" }).within(() => {
      cy.get("tbody tr").should("have.length", 1);
    });
  });
});
