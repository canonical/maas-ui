import { LONG_TIMEOUT } from "../../../constants";
import { captureCIFailureDiagnostics } from "../../../support/diagnostics";
import { generateMAASURL } from "../../utils";

context("Static Routes", () => {
  let stopDiagnostics: (() => void) | undefined;

  beforeEach(() => {
    stopDiagnostics = captureCIFailureDiagnostics({
      methods: ["subnet.list", "subnet.get", "subnet.set_active"],
      model: "subnet",
      snapshot: (document) => {
        const destination = document.querySelector<HTMLSelectElement>(
          'select[name="destination"]'
        );
        return {
          sourceHeading: document.querySelector("h1")?.textContent,
          destinationPresent: !!destination,
          destinationValue: destination?.value,
          destinationDisabled: destination?.disabled,
          destinationOptions: destination
            ? Array.from(destination.options).map((option) => ({
                label: option.text,
                value: option.value,
                disabled: option.disabled,
                selected: option.selected,
              }))
            : null,
        };
      },
    });
    cy.login();
    cy.visit(generateMAASURL("/networks?by=fabric"));
    cy.waitForPageToLoad();
    cy.viewport("macbook-11");
  });

  afterEach(() => {
    stopDiagnostics?.();
    stopDiagnostics = undefined;
  });

  it("allows adding, editing, and deleting a static route", () => {
    // Add static route
    cy.findByRole("grid", { name: "Subnets by Fabric" }).within(() => {
      cy.get("tbody").find('td[aria-label="subnet"]').find("a").first().click();
    });
    cy.findByRole("heading", { level: 1 }).invoke("text").as("subnet");

    cy.findByRole("link", { name: /static routes/i }).click();

    cy.findByRole("button", { name: /add static route/i }).click();
    cy.get("@subnet").then((subnet: unknown) => {
      cy.findByRole("complementary", { name: /Add static route/i }).within(
        () => {
          const staticRoute = (subnet as string).split("/")[0];
          cy.wrap(staticRoute).as("staticRoute");
          cy.findByLabelText(/gateway ip/i).type(staticRoute);
          cy.findByLabelText(/destination/i).select(1, {
            timeout: LONG_TIMEOUT,
          });
        }
      );
    });
    cy.findByRole("button", { name: /save/i }).click();
    cy.findByRole("complementary", { name: /Add static route/i }).should(
      "not.exist",
      { timeout: LONG_TIMEOUT }
    );

    // Edit static route
    cy.findByRole("region", { name: /Static routes/i }).within(() => {
      cy.get("tbody tr")
        .first()
        .findByRole("button", { name: /edit/i })
        .click();
    });

    cy.findByRole("complementary", { name: /Edit static route/i }).within(
      () => {
        cy.findByLabelText(/gateway ip/i).type("{Backspace}2");
        cy.findByRole("button", { name: /save/i }).click();
      }
    );

    // Verify the change has been saved and side panel closed
    cy.get("@staticRoute").then((staticRoute: unknown) => {
      cy.findByRole("region", { name: /Static routes/i }).within(() => {
        const newStaticRoute = (staticRoute as string).slice(0, -1) + "2";
        cy.findByText(newStaticRoute);
      });
    });
    cy.findByRole("complementary", { name: /Edit static route/i }).should(
      "not.exist",
      { timeout: LONG_TIMEOUT }
    );

    // Delete the static route
    cy.findByRole("region", { name: /Static routes/i }).within(() => {
      cy.get("tbody tr")
        .first()
        .findByRole("gridcell", { name: /actions/i })
        .findByRole("button", { name: /delete/i })
        .click();
    });

    // Verify it's been deleted and side panel closed
    cy.findByRole("complementary", { name: /Delete static route/i }).within(
      () => {
        cy.findByRole("button", { name: /delete/i }).click();
      }
    );
    cy.findByRole("complementary", {
      name: /Delete static route/i,
    }).should("not.exist", {
      timeout: LONG_TIMEOUT,
    });
    cy.get("@staticRoute").then((staticRoute: unknown) => {
      cy.findByRole("region", { name: /Static routes/i }).within(() => {
        cy.findByText(staticRoute as string).should("not.exist");
      });
    });
  });
});
