import { generateMAASURL } from "../../utils";

context("Static Routes", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/networks?by=fabric"));
    cy.waitForPageToLoad();
    cy.viewport("macbook-11");
  });
  it("allows adding, editing, and deleting a static route", () => {
    // Add static route
    cy.findByRole("grid", { name: "Subnets by Fabric" }).within(() => {
      cy.get("tbody").find('td[aria-label="subnet"]').find("a").first().click();
    });
    cy.findByRole("heading", { level: 1 }).invoke("text").as("subnet");

    cy.findByRole("button", { name: /add static route/i }).click();
    cy.get("@subnet").then((subnet: unknown) => {
      cy.findByRole("complementary", { name: /Add static route/i }).within(
        () => {
          const staticRoute = (subnet as string).split("/")[0];
          cy.wrap(staticRoute).as("staticRoute");
          cy.findByLabelText(/gateway ip/i).type(staticRoute);
          cy.findByLabelText(/destination/i).select(1);
        }
      );
    });
    cy.findByRole("button", { name: /save/i }).click();
    cy.findByRole("complementary", { name: /Add static route/i }).should(
      "not.exist"
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
        cy.findByLabelText(/gateway ip/i).type("{Backspace}1");
        cy.findByRole("button", { name: /save/i }).click();
      }
    );

    // Verify the change has been saved and side panel closed
    cy.get("@staticRoute").then((staticRoute: unknown) => {
      cy.findByRole("region", { name: /Static routes/i }).within(() => {
        cy.findByText(staticRoute as string);
      });
    });
    cy.findByRole("complementary", { name: /Add static route/i }).should(
      "not.exist"
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
    cy.get("@staticRoute").then((staticRoute: unknown) => {
      cy.findByRole("region", { name: /Static routes/i }).within(() => {
        cy.findByText(staticRoute as string).should("not.exist");
      });
    });
    cy.findByRole("region", { name: /side panel/i }).should("not.exist");
  });
});
