import { generateMAASURL, generateName } from "../../utils";

context("Machine listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
  });

  afterEach(() => {
    cy.window()
      // reset grouping to default
      .then((win) => win.localStorage.removeItem("grouping"));
  });

  it.skip("renders the correct heading", () => {
    cy.findByRole("heading", {
      name: /[0-9]+ machine[s]? in [0-9]+ pool[s]?/i,
    }).should("exist");
  });

  it.skip("can group machines by all supported keys", () => {
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
      cy.findByRole("grid", { name: `Machines - ${option}` }).should("exist");
    });
  });

  it.skip("displays machine counts with active filters", () => {
    const name = generateName();
    const searchFilter = `status:(=commissioning) hostname:(${name})`;
    const machines = [`${name}-1`, `${name}-2`];
    cy.addMachines(machines);
    cy.findByRole("combobox", { name: "Group by" }).select("Group by status");
    cy.findByRole("searchbox").type(searchFilter);
    cy.findByText(/Showing 2 out of 2 machines/).should("exist");
    cy.findByRole("grid", { name: /Machines/ }).within(() =>
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

  it("replaces the URL when selecting filters", () => {
    // visit network discovery first to have a page to go back to
    const intialPage = generateMAASURL("/network-discovery");
    cy.visit(intialPage);
    cy.visit(generateMAASURL("/machines"));

    cy.findByRole("searchbox").should("have.value", "");

    cy.findByRole("link", { name: /[0-9]+ pool[s]?/i }).should("exist");

    cy.findByRole("button", { name: /Filters/i }).click();

    cy.findByRole("tab", { name: /Status/i })
      .should("exist")
      .click();
    cy.findByRole("checkbox", { name: "Testing" }).click();

    // verify that the searchbox and URL are updated
    const expectMachineFilters = () => {
      cy.findByRole("searchbox").should("have.value", "status:(=testing)");
      cy.location().should((loc) => {
        expect(loc.search).to.eq("?status=%3Dtesting");
        expect(loc.pathname).to.eq(generateMAASURL("/machines"));
      });
    };
    expectMachineFilters();

    cy.go("back");
    // verify the user is navigated back to the previous page
    // (and not one step in the machine filters history)
    cy.location().should((loc) => {
      expect(loc.search).to.eq("");
      expect(loc.pathname).to.eq(intialPage);
    });

    cy.go("forward");
    // verify that previously selected filters are restored
    expectMachineFilters();
  });

  it.skip("can load filters from the URL", () => {
    cy.visit(generateMAASURL("/machines?status=%3Dnew"));
    cy.findByRole("searchbox").should("have.value", "status:(=new)");
  });

  it.skip("can hide machine table columns", () => {
    const allHeadersCount = 11;
    cy.viewport("macbook-15");

    cy.findAllByRole("columnheader").should("have.length", allHeadersCount);

    cy.findAllByRole("button", { name: "Columns" }).click();
    cy.findByLabelText("columns menu").within(() =>
      cy.findByRole("checkbox", { name: "Status" }).click({ force: true })
    );

    cy.findAllByRole("columnheader").should("have.length", allHeadersCount - 1);
    cy.findByRole("header", { name: "Status" }).should("not.exist");

    cy.reload();

    // verify that the hidden column is still hidden after refresh
    cy.findAllByRole("columnheader").should("have.length", allHeadersCount - 1);
    cy.findByRole("header", { name: "Status" }).should("not.exist");

    // verify that hidden columns are reset to default set for each breakpoint on window resize
    cy.viewport("samsung-s10");
    cy.findAllByRole("columnheader").should("have.length", 3);
    cy.viewport("macbook-15");
    cy.findAllByRole("columnheader").should("have.length", allHeadersCount);
  });

  it("can select a machine range", () => {
    const name = generateName();
    const newMachines = [`${name}-a`, `${name}-b`, `${name}-c`];
    cy.addMachines(newMachines);
    cy.findByRole("combobox", { name: "Group by" }).select("No grouping");
    cy.findByRole("searchbox", { name: "Search" }).type(name);
    cy.findByText(/Showing 3 out of 3 machines/).should("exist");
    cy.findByRole("checkbox", { name: `${newMachines[0]}.maas` }).click({
      force: true,
    });
    cy.findByRole("checkbox", { name: `${newMachines[2]}.maas` }).click({
      shiftKey: true,
      force: true,
    });
    cy.findByRole("checkbox", { name: `${newMachines[1]}.maas` }).should(
      "be.checked"
    );
    cy.findByRole("button", { name: /Delete/i }).click();
    cy.findByRole("button", { name: /Delete 3 machines/ }).click();
    cy.findByText(/No machines match the search criteria./).should("exist");
  });

  it("can filter machine list by deployment target", () => {
    cy.findByRole("link", { name: /[0-9]+ pool[s]?/i }).should("exist");

    cy.findByRole("button", { name: /filters/i }).click();
    cy.findByRole("tab", { name: /deployment target/i })
      .should("exist")
      .click();
    cy.findByRole("checkbox", { name: /deployed to disk/i }).should("exist");
    cy.findByRole("checkbox", { name: /deployed in memory/i })
      .should("exist")
      .click();
    cy.findByRole("searchbox").should(
      "have.value",
      "deployment_target:(=memory)"
    );
  });
});
