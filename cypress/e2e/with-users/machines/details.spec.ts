import { generateMAASURL } from "../../utils";

context("Machine details", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/machines"));
  });

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
});
