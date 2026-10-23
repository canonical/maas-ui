export const expectCollapsedNavigation = () => {
  cy.getMainNavigation().invoke("width").should("equal", 48);
  cy.getMainNavigation().within(() =>
    cy.findByRole("button", { name: /expand main navigation/i }).should("exist")
  );
};
export const expectExpandedNavigation = () => {
  cy.getMainNavigation().invoke("width").should("equal", 240);
  cy.getMainNavigation().within(() =>
    cy
      .findByRole("button", { name: /collapse main navigation/i })
      .should("exist")
  );
};
