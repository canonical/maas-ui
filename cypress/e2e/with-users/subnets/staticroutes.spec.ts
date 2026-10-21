import { LONG_TIMEOUT } from "../../../constants";
import { generateMAASURL, generateName } from "../../utils";

context("Static Routes", () => {
  const sourceCidr = "192.0.2.0/24";
  const destinationCidr = "198.51.100.0/24";
  const gatewayIp = "192.0.2.1";
  const editedGatewayIp = "192.0.2.2";
  let fabricName: string;
  let sourceName: string;
  let destinationName: string;
  let fabricCreated = false;
  let createdSubnets: string[] = [];

  beforeEach(() => {
    fabricName = generateName("static-route-fabric");
    sourceName = generateName("static-route-source");
    destinationName = generateName("static-route-destination");
    const vlanName = generateName("static-route-vlan");
    fabricCreated = false;
    createdSubnets = [];
    cy.login();
    cy.visit(generateMAASURL("/networks?by=fabric"));
    cy.waitForPageToLoad();
    cy.viewport("macbook-11");

    cy.findByRole("button", { name: "Add" }).click();
    cy.findByRole("button", { name: "Fabric" }).click();
    cy.findByRole("form", { name: "Add fabric" }).within(() => {
      cy.findByRole("textbox", { name: "Name (optional)" }).type(fabricName);
      cy.findByRole("button", { name: "Add Fabric" })
        .should("not.have.attr", "aria-disabled", "true")
        .click();
    });
    cy.findByRole("form", { name: "Add fabric", timeout: LONG_TIMEOUT })
      .should("not.exist")
      .then(() => {
        fabricCreated = true;
      });

    cy.findByRole("button", { name: "Add" }).click();
    cy.findByRole("button", { name: "VLAN" }).click();
    cy.findByRole("form", { name: "Add VLAN" }).within(() => {
      cy.findByRole("textbox", { name: "VID" }).type("1");
      cy.findByRole("textbox", { name: "Name" }).type(vlanName);
      cy.findByRole("combobox", { name: "Fabric" }).select(fabricName, {
        timeout: LONG_TIMEOUT,
      });
      cy.findByRole("button", { name: "Add VLAN" })
        .should("not.have.attr", "aria-disabled", "true")
        .click();
    });
    cy.findByRole("form", { name: "Add VLAN", timeout: LONG_TIMEOUT }).should(
      "not.exist"
    );

    [
      { name: sourceName, cidr: sourceCidr },
      { name: destinationName, cidr: destinationCidr },
    ].forEach(({ name, cidr }) => {
      cy.addSubnet({
        subnetName: name,
        cidr,
        fabric: fabricName,
        vid: "1",
        vlan: vlanName,
      });
      cy.findByRole("form", { name: "Add subnet", timeout: LONG_TIMEOUT })
        .should("not.exist")
        .then(() => {
          createdSubnets.push(name);
        });
      cy.findByRole("link", {
        name: new RegExp(name),
        timeout: LONG_TIMEOUT,
      }).should("exist");
    });
  });

  afterEach(() => {
    createdSubnets.forEach((name) => {
      cy.visit(generateMAASURL("/networks?by=fabric"));
      cy.findByRole("link", {
        name: new RegExp(name),
        timeout: LONG_TIMEOUT,
      }).click();
      cy.findByRole("button", { name: "Take action" }).click();
      cy.findByRole("button", { name: "Delete subnet" }).click();
      cy.findByRole("form", { name: "Delete subnet" }).within(() => {
        cy.findByRole("button", { name: "Delete" })
          .should("not.have.attr", "aria-disabled", "true")
          .click();
      });
      cy.location("pathname", { timeout: LONG_TIMEOUT }).should(
        "eq",
        generateMAASURL("/networks")
      );
      cy.findByRole("link", { name: new RegExp(name) }).should("not.exist");
    });

    if (fabricCreated) {
      cy.visit(generateMAASURL("/networks?by=fabric"));
      cy.findAllByRole("link", { name: fabricName, timeout: LONG_TIMEOUT })
        .first()
        .click();
      cy.findByRole("button", { name: "Delete fabric" }).click();
      cy.findByRole("complementary", { name: /Delete fabric/i }).within(() => {
        cy.findByRole("button", { name: "Delete fabric" })
          .should("not.have.attr", "aria-disabled", "true")
          .click();
      });
      cy.location("pathname", { timeout: LONG_TIMEOUT }).should(
        "eq",
        generateMAASURL("/networks")
      );
      cy.findByRole("link", { name: fabricName }).should("not.exist");
    }
  });

  it("allows adding, editing, and deleting a static route", () => {
    // Add static route
    cy.findByRole("link", {
      name: new RegExp(sourceName),
      timeout: LONG_TIMEOUT,
    }).click();

    cy.findByRole("link", { name: /static routes/i }).click();

    cy.findByRole("button", { name: /add static route/i }).click();
    cy.findByRole("complementary", { name: /Add static route/i }).within(() => {
      cy.findByLabelText(/gateway ip/i).type(gatewayIp);
      cy.findByLabelText(/destination/i).select(
        `${destinationCidr} (${destinationName})`,
        {
          timeout: LONG_TIMEOUT,
        }
      );
      cy.findByRole("button", { name: /save/i })
        .should("not.have.attr", "aria-disabled", "true")
        .click();
    });
    cy.findByRole("complementary", {
      name: /Add static route/i,
      timeout: LONG_TIMEOUT,
    }).should("not.exist");

    // Edit static route
    cy.findByRole("region", { name: /Static routes/i }).within(() => {
      cy.findByText(gatewayIp, { timeout: LONG_TIMEOUT })
        .closest("tr")
        .findByRole("button", { name: /edit/i })
        .click();
    });

    cy.findByRole("complementary", { name: /Edit static route/i }).within(
      () => {
        cy.findByLabelText(/gateway ip/i).clear();
        cy.findByLabelText(/gateway ip/i).type(editedGatewayIp);
        cy.findByRole("button", { name: /save/i })
          .should("not.have.attr", "aria-disabled", "true")
          .click();
      }
    );

    // Verify the change has been saved and side panel closed
    cy.findByRole("complementary", {
      name: /Edit static route/i,
      timeout: LONG_TIMEOUT,
    }).should("not.exist");
    cy.findByRole("region", { name: /Static routes/i }).within(() => {
      cy.findByText(editedGatewayIp, { timeout: LONG_TIMEOUT }).should("exist");
    });

    // Delete the static route
    cy.findByRole("region", { name: /Static routes/i }).within(() => {
      cy.findByText(editedGatewayIp)
        .closest("tr")
        .findByRole("button", { name: /delete/i })
        .click();
    });

    // Verify it's been deleted and side panel closed
    cy.findByRole("complementary", { name: /Delete static route/i }).within(
      () => {
        cy.findByRole("button", { name: /delete/i })
          .should("not.have.attr", "aria-disabled", "true")
          .click();
      }
    );
    cy.findByRole("complementary", {
      name: /Delete static route/i,
      timeout: LONG_TIMEOUT,
    }).should("not.exist");
    cy.findByRole("region", { name: /Static routes/i }).within(() => {
      cy.findByText(editedGatewayIp, { timeout: LONG_TIMEOUT }).should(
        "not.exist"
      );
    });
  });
});
