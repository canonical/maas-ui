import maasDocsUrls from "@maas-ui/maas-ui/src/app/base/maasDocsUrls";

context("maas.io docs contain specified resources", () => {
  Object.values(maasDocsUrls).forEach((url) => {
    it(url, () => {
      cy.visit(url);
      const { hash } = new URL(url);
      if (hash) {
        cy.get(hash).should("exist");
      }
    });
  });
});
