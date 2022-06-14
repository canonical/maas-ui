import docsUrls from "../../../src/app/base/docsUrls";

const urls = Object.values(docsUrls);

context("docs resource exists", () => {
  beforeEach(() => {
    cy.setCookie("_cookies_accepted", "all");
  });

  urls.forEach((url) => {
    it(url, () => {
      cy.visit(url);
      const { hash } = new URL(url);
      if (hash) {
        cy.get(hash).should("exist");
      }
    });
  });
});

context("docs resources have no redirects", () => {
  urls.forEach((url) => {
    it(url, () => {
      cy.visit(url);
      cy.url().should("equal", url);
    });
  });
});
