import { generateMAASURL, generateName } from "../../utils";

const MACHINE_ACTIONS_GROUPS = [
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
] as const;

const selectFirstMachine = () =>
  cy.findByRole("grid", { name: /Machines/i }).within(() => {
    cy.findAllByRole("gridcell", { name: /FQDN/i })
      .first()
      .within(() => cy.findByRole("checkbox").click({ force: true }));
  });

const openMachineActionForm = (groupLabel: string, action: string) => {
  cy.findByRole("button", { name: groupLabel }).click();
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
    cy.waitForTableToLoad({ name: /Machines/i });
  });

  it("displays the correct actions in the action menu", () => {
    selectFirstMachine();
    MACHINE_ACTIONS_GROUPS.forEach((actionGroup) => {
      cy.findByRole("button", { name: actionGroup.label }).click();
      cy.findByLabelText("submenu").within(() => {
        cy.findAllByRole("button").should(
          "have.length",
          actionGroup.actions.length
        );
        cy.findAllByRole("button").should("be.enabled");
      });
    });
    cy.findByRole("button", { name: /Delete/i }).should("exist");
    cy.findByRole("button", { name: /Delete/i }).should("be.enabled");
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
    cy.findByRole("button", { name: /Delete/i }).click();
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
    cy.findByRole("checkbox", { name: `${machineName}.maas` }).click({
      force: true,
    });
    openMachineActionForm("Categorise", "Set pool");
    cy.findByRole("complementary", { name: /Set pool/i }).should("exist");
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

  it("can create and add a tag to a machine", () => {
    const tagName = generateName("tag");
    const machineName = generateName("machine");
    cy.addMachine(machineName);
    cy.findByRole("searchbox", { name: "Search" }).type(machineName);
    cy.waitForTableToLoad({ name: /Machines/i });
    cy.findByRole("checkbox", { name: `${machineName}.maas` }).click({
      force: true,
    });
    openMachineActionForm("Categorise", "Tag");
    cy.findByRole("complementary", { name: /Tag/i }).should("exist");
    cy.findByRole("textbox", {
      name: "Search existing or add new tags",
    }).type(tagName);
    cy.findByRole("button", { name: `Create tag "${tagName}"` }).click();
    cy.findByRole("form", { name: /Create tag/i }).should("be.visible");
    cy.findByRole("button", { name: /Create and add to tag changes/i }).click();
    cy.findByRole("table", { name: /Tag changes/i }).within(() => {
      cy.findByRole("cell", { name: /To be added/ }).should("exist");
      cy.findByRole("cell", { name: new RegExp(tagName, "i") }).should("exist");
    });
    cy.findByRole("button", { name: /Save/i }).click();
    cy.findByRole("grid", { name: /Machines/i })
      .within(() => cy.findByText(tagName))
      .should("exist");
    cy.deleteMachine(machineName);
  });
});
