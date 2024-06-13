import docsUrls from "../../../src/app/base/docsUrls";

const urls = Object.values(docsUrls);

beforeEach(() => {
  cy.setCookie("_cookies_accepted", "all");
});

context("loads the page", () => {
  urls.forEach((url) => {
    it(url, () => {
      // test that the page loads, can be redirected
      cy.visit(url);
    });
  });
});

context("is a direct link", () => {
  urls.forEach((url) => {
    it(url, () => {
      cy.visit(url);

      // print warning if the URL is redirected
      cy.request({
        url,
        followRedirect: false,
      }).then((resp) => {
        if (resp.redirectedToUrl) {
          expect(
            resp.redirectedToUrl,
            `URL NEEDS TO BE UPDATED
          -----------------------------

          FROM:
          ${url}
          
          TO:
          ${resp.redirectedToUrl}
          
          error`
          ).to.eq(url);
        }
      });
    });
  });
});

context("contains the specified heading", () => {
  urls.forEach((url) => {
    it(`URL: ${url}`, () => {
      const { hash } = new URL(url);
      if (hash) {
        cy.visit(url);
        cy.get(hash).should("exist");
      }
    });
  });
});
