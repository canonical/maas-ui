import { LONG_TIMEOUT } from "../../../constants";
import { generateMAASURL, generateMac, generateName } from "../../utils";

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
    const { name } = completeAddMachineForm();

    cy.findByRole("searchbox").type(name);
    cy.findByRole("grid", { name: /Loading/i }).should("not.exist");

    cy.findByRole("link", {
      name: new RegExp(name, "i"),
      timeout: LONG_TIMEOUT,
    }).click();

    cy.findByRole("link", { name: "Network" }).click();

    cy.findAllByRole("columnheader", { name: /IP/i }).first().should("exist");
    cy.findByRole("columnheader", { name: /subnet/i })
      .first()
      .should("exist");

    cy.viewport("ipad-mini", "landscape");

    cy.findAllByRole("columnheader", { name: /IP/i }).first().should("exist");
    cy.findByRole("columnheader", { name: /subnet/i }).should("not.exist");

    // delete the machine
    cy.findByRole("button", { name: /Menu/i }).click();
    cy.findByRole("button", { name: /Delete/i }).click();
    cy.findByRole("button", { name: /Delete machine/i }).click();
    cy.waitForPageToLoad();
    // verify the user has been redirected to the machine list
    cy.url().should("include", generateMAASURL("/machines"));
  });

  it("displays machine commissioning details", () => {
    const { name } = completeAddMachineForm();

    cy.findByRole("searchbox").type(name);
    cy.findByRole("grid", { name: /Loading/i }).should("not.exist");

    cy.findByRole("link", {
      name: new RegExp(name, "i"),
      timeout: LONG_TIMEOUT,
    }).click();

    cy.waitForPageToLoad();
    cy.findByRole("button", {
      name: /Actions/i,
    }).click();

    // abort commissioning
    cy.findByLabelText("Actions submenu").within(() => {
      cy.findByRole("button", { name: /Abort/i }).should("be.visible");

      cy.findByRole("button", { name: /Abort/i }).click();
    });

    cy.findByRole("button", { name: /Abort actions/i })
      .should("be.visible")
      .and("not.be.disabled");
    cy.findByRole("button", { name: /Abort actions for machine/i }).click();

    cy.findByRole("link", { name: /Scripts/i }).click();
    cy.findByRole("tab", { name: /Commissioning/i }).click();
    cy.findByRole("grid").within(() => {
      cy.get("tbody tr")
        .first()
        .within(() => {
          cy.findByTestId("details-link", { timeout: LONG_TIMEOUT }).click();
        });
    });
    cy.waitForPageToLoad();
    cy.findByRole("heading", { level: 2, name: /details/i }).should("exist");

    // delete the machine
    cy.findByRole("button", { name: /Delete/i }).click();
    cy.findByRole("button", { name: /Delete machine/i }).click();
    cy.waitForPageToLoad();
    // verify the user has been redirected to the machine list
    cy.url().should("include", generateMAASURL("/machines"));
  });
});
