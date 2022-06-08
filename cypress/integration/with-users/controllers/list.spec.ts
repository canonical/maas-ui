import { generateMAASURL } from "../../utils";

context("Controller listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/controllers"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Controllers");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/controllers")
    );
  });

  it("can add a tag to the controller", () => {
    const tagName = "new-tag";

    // displays the controller details page on click of the controller name
    cy.findAllByRole("gridcell", { name: "Name" })
      .first()
      .within(() => {
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

    cy.get("input[placeholder='Add a tag']").type(`${tagName}{enter}{esc}`);
    cy.findByRole("button", { name: /Save changes/ }).click();

    cy.findByRole("tab", { name: /Controller summary/ }).click();
    cy.findByRole("link", { name: tagName }).should("exist");

    // displays the controller listing page filtered by tag on click of the tag name
    cy.findByRole("link", { name: tagName }).click();

    // displays the correct tag in the searchbox
    cy.findByRole("searchbox", { name: /Search/ }).should(
      "have.value",
      `tags:(${tagName})`
    );

    // displays the correct number of controllers
    cy.findByRole("grid", { name: "controllers list" }).within(() => {
      cy.get("tbody tr").should("have.length", 1);
    });
  });

  it("lists valid actions on the controller details page", () => {
    cy.findAllByRole("gridcell", { name: "Name" })
      .first()
      .within(() => {
        cy.findByRole("link").click();
      });

    cy.findByText(/Take action/).click();

    [/Import images/i, /Delete/i].forEach((name) =>
      cy
        .findByRole("button", {
          name,
        })
        .should("exist")
    );
    [/Set zone/i].forEach((name) =>
      cy
        .findByRole("button", {
          name,
        })
        .should("not.exist")
    );
  });
});
