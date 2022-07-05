import { generateMAASURL } from "../../utils";
import { generateName, generateMac } from "../../utils";

context("Machine details", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
  });

  const completeAddMachineForm = () => {
    const name = generateName("machine");
    cy.findByRole("button", { name: /Add hardware/i }).click();
    cy.findByLabelText("submenu").within(() => {
      cy.findByRole("button", { name: /Machine/i }).click();
    });
    cy.findByLabelText("Machine name").type(name);
    cy.findByLabelText("MAC address").type(generateMac());
    cy.findByLabelText("Power type").select("Manual");
    cy.get("button[type='submit']").click();
    return { name };
  };

  it("hides the subnet column on small screens", () => {
    cy.findByRole("grid").within(() => {
      cy.findAllByRole("gridcell", { name: /FQDN/i })
        .first()
        .within(() => cy.findByRole("link").click());
    });
    cy.findByRole("link", { name: "Network" }).click();

    cy.findAllByRole("columnheader", { name: /IP/i }).first().should("exist");
    cy.findByRole("columnheader", { name: /subnet/i })
      .first()
      .should("exist");

    cy.viewport("ipad-mini", "landscape");

    cy.findAllByRole("columnheader", { name: /IP/i }).first().should("exist");
    cy.findByRole("columnheader", { name: /subnet/i }).should("not.exist");
  });

  it("displays machine commissioning details", () => {
    const { name } = completeAddMachineForm();

    cy.findByRole("link", { name: new RegExp(name, "i") }).click();

    cy.waitForPageToLoad();
    cy.get("[data-testid='section-header-buttons']").within(() =>
      cy
        .findByRole("button", {
          name: /Take action/i,
        })
        .click()
    );

    // abort commissioning
    cy.findByLabelText("submenu").within(() => {
      cy.findByRole("button", { name: /Abort/i }).click();
    });
    cy.findByRole("button", { name: /Abort actions for machine/i }).click();

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

    // delete the machine
    cy.get("[data-testid='section-header-buttons']").within(() =>
      cy
        .findByRole("button", {
          name: /Take action/i,
        })
        .click()
    );
    cy.findByLabelText("submenu").within(() => {
      cy.findByRole("button", { name: /Delete/i }).click();
    });
    cy.findByRole("button", { name: /Delete machine/i }).click();
  });
});
