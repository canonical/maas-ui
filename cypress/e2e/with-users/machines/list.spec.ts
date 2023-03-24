import { generateMAASURL, generateName } from "../../utils";

context("Machine listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
  });

  it("renders the correct heading", () => {
    cy.findByRole("heading", {
      name: /[0-9]+ machine[s]? in [0-9]+ pool[s]?/i,
    }).should("exist");
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

  it("displays machine counts with active filters", () => {
    const name = generateName();
    const searchFilter = `status:(=commissioning) hostname:(${name})`;
    const machines = [`${name}-1`, `${name}-2`];
    cy.addMachines(machines);
    cy.findByRole("combobox", { name: "Group by" }).select("Group by status");
    cy.findByRole("searchbox").type(searchFilter);
    cy.findByText(/Showing 2 out of 2 machines/).should("exist");
    cy.findByRole("grid", { name: "Machines" }).within(() =>
      // eslint-disable-next-line cypress/no-force
      cy
        .findByRole("checkbox", { name: /Commissioning/i })
        .click({ force: true })
    );
    cy.findByRole("button", { name: /Delete/i }).click();
    cy.findByRole("button", { name: /Delete 2 machines/ }).should("exist");
    cy.findByRole("button", { name: /Delete 2 machines/ }).click();
    cy.findByRole("searchbox").should("have.value", searchFilter);
    cy.findByText(/No machines match the search criteria./).should("exist");
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

  it("can select a machine range", () => {
    const name = generateName();
    const newMachines = [`${name}-a`, `${name}-b`, `${name}-c`];
    cy.addMachines(newMachines);
    cy.findByRole("combobox", { name: "Group by" }).select("No grouping");
    cy.findByRole("searchbox", { name: "Search" }).type(name);
    cy.findByText(/Showing 3 out of 3 machines/).should("exist");
    // eslint-disable-next-line cypress/no-force
    cy.findByRole("checkbox", { name: `${newMachines[0]}.maas` }).click({
      force: true,
    });
    // eslint-disable-next-line cypress/no-force
    cy.findByRole("checkbox", { name: `${newMachines[2]}.maas` }).click({
      shiftKey: true,
      force: true,
    });
    cy.findByRole("checkbox", { name: `${newMachines[1]}.maas` }).should(
      "be.checked"
    );
    cy.findByTestId("section-header-buttons").within(() =>
      cy.findByRole("button", { name: /Delete/i }).click()
    );
    cy.findByRole("button", { name: /Delete 3 machines/ }).click();
    cy.findByText(/No machines match the search criteria./).should("exist");
  });
});
