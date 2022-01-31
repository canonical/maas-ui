import { generateNewURL } from "@maas-ui/maas-ui-shared";
import { generateId, generateVid } from "../utils";

context("Subnets - Add", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/networks?by=fabric"));
    cy.viewport("macbook-11");
  });

  const openAddForm = (name: string) => {
    cy.findByRole("button", { name: "Add" }).click();
    cy.findByRole("button", { name }).click();
  };

  const submitForm = (formName: string) => {
    cy.findByRole("button", { name: `Add ${formName}` }).click();
  };

  const completeAddVlanForm = (
    vid: string,
    name: string,
    fabricName?: string,
    spaceName?: string
  ) => {
    openAddForm("VLAN");
    cy.findByRole("textbox", { name: "VID" }).type(vid);
    cy.findByRole("combobox", { name: "Fabric" }).select(fabricName || 1);
    cy.findByRole("combobox", { name: "Space" }).select(spaceName || 1);
    cy.findByRole("textbox", { name: "Name" }).type(name);
    cy.findByRole("button", { name: "Add VLAN" }).click();
  };

  const completeAddSubnetForm = (
    subnetName: string,
    cidr: string,
    fabric: string,
    vid: string,
    vlan: string
  ) => {
    openAddForm("Subnet");
    cy.findByRole("textbox", { name: "CIDR" }).type(cidr);
    cy.findByRole("textbox", { name: "Name" }).type(subnetName);
    cy.findByRole("combobox", { name: "Fabric" }).select(fabric);
    cy.findByRole("combobox", { name: "VLAN" }).select(`${vid} (${vlan})`);
    cy.findByRole("button", { name: "Add Subnet" }).click();
  };

  const completeForm = (formName: string, name: string) => {
    openAddForm(formName);
    cy.findByRole("textbox", { name: "Name (optional)" }).type(name);
    submitForm(formName);
  };

  it(`displays a newly added Fabric in the subnets table`, () => {
    const name = `cypress-${generateId()}`;
    completeForm("Fabric", name);
    cy.findByRole("table", { name: "Subnets" }).within(() => {
      cy.findByRole("row", { name }).within(() =>
        cy.findByRole("link", { name }).should("be.visible")
      );
    });
  });

  it("can add and delete a new space", () => {
    cy.visit(generateNewURL("/networks?by=space"));
    const name = `cypress-${generateId()}`;
    completeForm("Space", name);
    cy.findByRole("table", { name: "Subnets" }).within(() => {
      cy.findByRole("link", { name }).click();
    });

    cy.url().should("include", generateNewURL("/space"));

    cy.findByRole("button", { name: "Delete" }).click();

    cy.findByText(`Are you sure you want to delete ${name} space?`).should(
      "be.visible"
    );

    cy.findByRole("button", { name: "Yes, delete space" }).click();

    cy.url().should("include", generateNewURL("/networks?by=space"));
    cy.findByRole("table", { name: "Subnets" }).within(() => {
      cy.findByRole("link", { name }).should("not.exist");
    });
  });

  it("Groups items added to the same fabric correctly", () => {
    const fabricName = `cy-fabric-${generateId()}`;
    const spaceName = `cy-space-${generateId()}`;
    const vid = generateVid();
    const vlanName = `cy-vlan-${vid}`;
    const cidr = "192.168.122.18";
    const subnetName = `cy-subnet-${generateId()}`;

    completeForm("Fabric", fabricName);
    completeForm("Space", spaceName);
    completeAddVlanForm(vid, vlanName, fabricName, spaceName);
    completeAddSubnetForm(subnetName, cidr, fabricName, vid, vlanName);

    cy.findAllByRole("row", { name: fabricName }).should("have.length", 2);

    cy.findAllByRole("row", { name: fabricName })
      .first()
      .within(() => {
        cy.findByRole("rowheader").within(() =>
          cy.findByText(fabricName).should("be.visible")
        );
      });

    cy.findAllByRole("row", { name: fabricName })
      .eq(1)
      .within(() => {
        cy.findByRole("rowheader").within(() =>
          cy.findByText(fabricName).should("not.be.visible")
        );
        cy.findByRole("column", { name: "VLAN" }).should(
          "have.text",
          `${vid} (${vlanName})`
        );
        cy.findByRole("column", { name: "Subnet" }).should(
          "include.text",
          `(${subnetName})`
        );
        cy.findByRole("column", { name: "Space" }).should(
          "have.text",
          spaceName
        );
      });
  });

  it("displays an error when trying to add a VLAN with a VID that already exists", () => {
    const vid = generateVid();
    const name = `cypress-${vid}`;
    completeAddVlanForm(vid, name);
    completeAddVlanForm(vid, name);
    cy.findByText(
      /A VLAN with the specified VID already exists in the destination fabric./
    ).should("exist");
  });

  it(`displays an error when trying to add a Fabric with a name that already exists`, () => {
    const name = `cypress-${generateId()}`;
    completeForm("Fabric", name);
    completeForm("Fabric", name);
    cy.findByText(/this Name already exists/).should("be.visible");
  });

  it(`displays an error when trying to add a Space with a name that already exists`, () => {
    const name = `cypress-${generateId()}`;
    completeForm("Space", name);
    completeForm("Space", name);
    cy.findByText(/this Name already exists/).should("be.visible");
  });
});
