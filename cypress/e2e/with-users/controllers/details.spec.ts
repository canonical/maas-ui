import { generateMAASURL, generateId } from "../../utils";

context("Controller details", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/controllers"));
  });

  it("can add a tag to the controller", () => {
    const tagName = `tag-${generateId()}`;

    // displays the controller details page on click of the controller name
    cy.findAllByRole("gridcell", { name: "Name" })
      .first()
      .within(() => {
        cy.findByRole("link").click();
      });

    cy.findByText(/Summary/).should("exist");

    // can add a tag to the controller
    cy.findByRole("link", {
      name: /Configuration/,
    }).click();
    cy.findAllByRole("button", {
      name: /Edit/,
    })
      .first()
      .click();

    cy.findByRole("form", { name: /Controller configuration/ }).should("exist");
    cy.get("input[placeholder='Create or remove tags']").type(
      `${tagName}{enter}`
    );
    cy.findByRole("button", { name: /Create and add to tag changes/ }).click();
    cy.findByRole("button", { name: /Save changes/ }).click();

    cy.findByRole("link", { name: /Summary/ }).click();
    cy.findByTestId("machine-tags").contains(tagName);

    // displays the controller listing page filtered by tag on click of the tag name
    cy.findByRole("link", {
      name: /Configuration/,
    }).click();
    cy.findByRole("link", {
      name: tagName,
    }).click();

    // displays the correct tag in the searchbox
    cy.findByRole("searchbox", { name: /Search/ }).should(
      "have.value",
      `tags:(=${tagName})`
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
    [/Deploy/i].forEach((name) =>
      cy
        .findByRole("button", {
          name,
        })
        .should("not.exist")
    );
  });

  it("displays controller commissioning details", () => {
    cy.waitForPageToLoad();
    cy.get("[data-testid='section-header-buttons']").within(() =>
      cy
        .findByRole("button", {
          name: /Take action/i,
        })
        .click()
    );

    cy.findByRole("link", { name: "Commissioning" }).click();
    cy.findByRole("grid").within(() => {
      cy.findAllByRole("button", { name: /Take action/i })
        .first()
        .click();
    });
    cy.findByLabelText("submenu").within(() => {
      cy.findAllByRole("link", { name: /View details/i }).click();
    });
    cy.findByRole("heading", { level: 2, name: /details/i }).should("exist");
  });
});
