import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import {
  generateCidr,
  generateId,
  generateMAASURL,
  generateVid,
} from "../../../e2e/utils";
import { completeAddVlanForm, completeForm } from "./add.helpers";

When("the user creates a new fabric", function () {
  this.fabric = `cy-fabric-${generateId()}`;

  completeForm("Fabric", this.fabric);
});

When("the user creates a new space", function () {
  this.spaceName = `cy-space-${generateId()}`;

  completeForm("Space", this.spaceName);
});

When("the user creates a new VLAN", function () {
  this.vid = generateVid();
  this.vlan = `cy-vlan-${this.vid}`;

  completeAddVlanForm(this.vid, this.vlan, this.fabric!, this.spaceName!);
});

When("the user creates a new subnet", function () {
  this.cidr = generateCidr();
  this.subnetName = `cy-subnet-${generateId()}`;

  cy.addSubnet({
    subnetName: this.subnetName,
    cidr: this.cidr,
    fabric: this.fabric!,
    vid: this.vid!,
    vlan: this.vlan!,
  });
});

When("the user deletes the created subnet", function () {
  cy.findByRole("link", { name: new RegExp(this.subnetName) }).click();
  cy.findByRole("button", { name: "Take action" }).click();
  cy.findByRole("button", { name: "Delete subnet" }).click();
  cy.findByText(/Are you sure you want to delete this subnet?/).should(
    "be.visible"
  );
  cy.findByRole("button", { name: "Delete" }).click();

  cy.url().should("include", generateMAASURL("/networks?by=fabric"));
});

When("the user tries to add a VLAN with a VID that already exists", () => {
  const vid = generateVid();
  const name = `cypress-${vid}`;
  completeAddVlanForm(vid, name);
  completeAddVlanForm(vid, name);
});

When("the user tries to add a Fabric with a name that already exists", () => {
  const name = `cypress-${generateId()}`;
  completeForm("Fabric", name);
  completeForm("Fabric", name);
});

When("the user tries to add a Space with a name that already exists", () => {
  const name = `cypress-${generateId()}`;
  completeForm("Space", name);
  completeForm("Space", name);
});

Then("the subnet appears under the correct fabric", function () {
  cy.findByRole("button", { name: "Save VLAN" }).should("not.exist");
  cy.findByRole("searchbox", { name: "Search" }).type(this.fabric!);

  cy.contains(this.fabric).should("be.visible");
  cy.findByRole("row", { name: new RegExp(this.fabric) }).should("exist");

  cy.findAllByRole("link", { name: this.fabric }).should("have.length", 1);

  cy.findAllByRole("row", { name: new RegExp(this.fabric) })
    .next("tr")
    .within(() => {
      cy.findAllByRole("cell").eq(0).should("contain.text", this.subnetName);
      cy.findAllByRole("cell")
        .eq(1)
        .should("have.text", `${this.vid} (${this.vlan})`);
      cy.findAllByRole("cell").eq(4).should("have.text", this.spaceName);
    });
});

Then("fabric list should not include deleted subnet", function () {
  cy.url().should("include", generateMAASURL("/networks?by=fabric"));
  cy.findByRole("link", { name: new RegExp(this.subnetName) }).should(
    "not.exist"
  );
});

Then("an error is displayed", () => {
  cy.findByText(
    /A VLAN with the specified VID already exists in the destination fabric./
  ).should("exist");
});

Then("text {string} should be visible", (text: string) => {
  cy.findByText(new RegExp(text, "i")).should("be.visible");
});
