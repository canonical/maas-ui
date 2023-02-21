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
    cy.findByRole("link", { current: "page" }).should(
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

  it("displays machine counts with active filters", () => {
    const searchFilter = "status:(=commissioning) hostname:(machine-)";
    cy.addMachines(["machine-1", "machine-2"]);
    cy.findByRole("combobox", { name: "Group by" }).select("Group by status");
    cy.findByRole("searchbox").type(searchFilter);
    cy.findByText(/Showing 2 out of 2 machines/).should("exist");
    cy.findByRole("grid", { name: "Machines" }).within(() =>
      // eslint-disable-next-line cypress/no-force
      cy
        .findByRole("checkbox", { name: /Commissioning/i })
        .click({ force: true })
    );
    cy.findByRole("button", { name: /Take action/i }).click();
    cy.findByLabelText("submenu").within(() => {
      cy.findAllByRole("button", { name: /Delete/i }).click();
    });
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
    const searchFilter = "machi";
    const newMachines = ["machine-a", "machine-b", "machine-c"];
    cy.addMachines(newMachines);
    cy.findByRole("combobox", { name: "Group by" }).select("No grouping");
    cy.findByRole("searchbox", { name: "Search" }).type(searchFilter);
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
      cy.findByRole("button", { name: /Take action/i }).click()
    );
    cy.findByLabelText("submenu").within(() => {
      cy.findAllByRole("button", { name: /Delete/i }).click();
    });
    cy.findByRole("button", { name: /Delete 3 machines/ }).click();
  });
});
