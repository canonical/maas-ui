import { generateMAASURL, generateName } from "../../utils";

type ActionGroup = {
  label: string;
  actions: string[];
};

const MACHINE_ACTIONS_GROUPS: ActionGroup[] = [
  {
    label: "Actions",
    actions: [
      "Commission",
      "Allocate",
      "Deploy",
      "Release",
      "Abort",
      "Clone from",
    ],
  },
  {
    label: "Power cycle",
    actions: ["Power on", "Power off"],
  },
  {
    label: "Troubleshoot",
    actions: [
      "Test",
      "Enter rescue mode",
      "Exit rescue mode",
      "Mark fixed",
      "Mark broken",
      "Override failed testing",
    ],
  },
  {
    label: "Categorise",
    actions: ["Tag", "Set zone", "Set pool"],
  },
  {
    label: "Lock",
    actions: ["Lock", "Unlock"],
  },
];

const selectFirstMachine = () =>
  cy.findByRole("grid", { name: /Machines/i }).within(() => {
    cy.findAllByRole("gridcell", { name: /FQDN/i })
      .first() // eslint-disable-next-line cypress/no-force
      .within(() => cy.findByRole("checkbox").click({ force: true }));
  });

const openMachineActionForm = (groupLabel: string, action: string) => {
  cy.findByTestId("section-header-buttons").within(() => {
    cy.findByRole("button", { name: groupLabel }).click();
  });
  cy.findByLabelText("submenu").within(() => {
    cy.findAllByRole("button", {
      name: new RegExp(`${action}...`),
    }).click();
  });
};

context("Machine listing - actions", () => {
  const machineName = generateName("machine");
  before(() => {
    cy.login();
    cy.addMachine(machineName);
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
    MACHINE_ACTIONS_GROUPS.forEach((actionGroup) => {
      cy.findByTestId("section-header-buttons").within(() => {
        cy.findByRole("button", { name: actionGroup.label }).click();
      });
      cy.findByLabelText("submenu").within(() => {
        cy.findAllByRole("button").should(
          "have.length",
          actionGroup.actions.length
        );
        cy.findAllByRole("button").should("be.enabled");
      });
    });
    cy.findByTestId("section-header-buttons").within(() => {
      cy.findByRole("button", { name: /Delete/i }).should("exist");
      cy.findByRole("button", { name: /Delete/i }).should("be.enabled");
    });
  });

  MACHINE_ACTIONS_GROUPS.forEach((actionGroup) =>
    actionGroup.actions.forEach((action) =>
      it(`loads machine ${action} form`, () => {
        selectFirstMachine();
        openMachineActionForm(actionGroup.label, action);
        cy.findByRole("complementary", { name: action }).within(() => {
          cy.findAllByText(/Loading/).should("have.length", 0);
          cy.findByRole("heading", { name: action });
          cy.findByRole("button", { name: /Cancel/i }).click();
        });
        // expect the action form to be closed
        cy.findByRole("complementary", { name: action }).should("not.exist");
      })
    )
  );

  it("loads machine Delete form", () => {
    selectFirstMachine();
    cy.findByTestId("section-header-buttons").within(() => {
      cy.findByRole("button", { name: /Delete/i }).click();
    });

    cy.findByRole("complementary", { name: /Delete/i }).within(() => {
      cy.findAllByText(/Loading/).should("have.length", 0);
      cy.findByRole("heading", { name: /Delete/i });
      cy.findByRole("button", { name: /Cancel/i }).click();

      // expect the action form to be closed
      cy.findByRole("complementary", { name: /Delete/i }).should("not.exist");
    });
  });

  it("can create and set the zone of a machine", () => {
    const poolName = generateName("pool");
    const machineName = generateName("machine");
    cy.addMachine(machineName);
    cy.findByRole("searchbox", { name: "Search" }).type(machineName);
    // eslint-disable-next-line cypress/no-force
    cy.findByRole("checkbox", { name: `${machineName}.maas` }).click({
      force: true,
    });
    openMachineActionForm("Categorise", "Set pool");
    cy.findByRole("complementary", { name: /Set pool/i }).should("exist");
    // eslint-disable-next-line cypress/no-force
    cy.findByLabelText(/Create pool/i).click({ force: true });
    cy.findByLabelText(/Name/i).type(poolName);
    cy.findByRole("button", { name: /Set pool for machine/i }).click();
    cy.findByRole("complementary", { name: /Set pool/i }).should("not.exist");
    cy.findByRole("grid", { name: /Machines/i })
      .within(() => cy.findByText(poolName))
      .should("exist");
    cy.deleteMachine(machineName);
    cy.deletePool(poolName);
  });
});
