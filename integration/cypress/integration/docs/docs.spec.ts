import docsUrls from "@maas-ui/maas-ui/src/app/base/docsUrls";

context("docs resources exists", () => {
  beforeEach(() => {
    cy.setCookie("_cookies_accepted", "all");
  });

  Object.values(docsUrls).forEach((url) => {
    it(url, () => {
      cy.visit(url);
      const { hash } = new URL(url);
      if (hash) {
        cy.get(hash).should("exist");
      }
    });
  });
});
