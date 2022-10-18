import { generateMAASURL } from "../../utils";

const MACHINE_ACTIONS = [
  "Commission",
  "Allocate",
  "Deploy",
  "Release",
  "Abort",
  "Clone from",
  "Power on",
  "Power off",
  "Test",
  "Enter rescue mode",
  "Exit rescue mode",
  "Mark fixed",
  "Mark broken",
  "Override failed testing",
  "Lock",
  "Unlock",
  "Tag",
  "Set zone",
  "Set pool",
  "Delete",
];

const selectFirstMachine = () =>
  cy.findByRole("grid", { name: /Machines/i }).within(() => {
    cy.findAllByRole("gridcell", { name: /FQDN/i })
      .first() // eslint-disable-next-line cypress/no-force
      .within(() => cy.findByRole("checkbox").click({ force: true }));
  });

context("Machine listing - actions", () => {
  before(() => {
    cy.login();
    cy.addMachine();
  });
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
    cy.waitForPageToLoad();
    // cy.wait for table data to fully load
    cy.waitForTableToLoad({ name: "Machines" });
  });

  it("displays the correct actions in the action menu", () => {
    selectFirstMachine();
    cy.findByRole("button", { name: /Take action/i }).click();
    cy.findByLabelText("submenu").within(() => {
      cy.findAllByRole("button").should("have.length", MACHINE_ACTIONS.length);
      cy.findAllByRole("button").should("be.enabled");
    });
  });

  MACHINE_ACTIONS.forEach((action) =>
    it(`loads machine ${action} form`, () => {
      const actionLabel = new RegExp(`${action}...`, "i"); // case insensitive
      selectFirstMachine();
      cy.findByRole("button", { name: /Take action/i }).click();
      cy.findByLabelText("submenu").within(() => {
        cy.findAllByRole("button", { name: actionLabel }).click();
      });
      cy.findByTestId("section-header-title")
        .contains(actionLabel)
        .should("exist");
      cy.get("[data-testid='section-header-content']").within(() => {
        cy.findAllByText(/Loading/).should("have.length", 0);
        cy.findByRole("button", { name: /Cancel/i }).click();
      });
      // expect the action form to be closed
      cy.findByTestId("section-header-title")
        .contains(actionLabel)
        .should("not.exist");
    })
  );
});
