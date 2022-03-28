import { generateNewURL } from "@maas-ui/maas-ui-shared";
import { pages } from "../../constants";

pages.forEach(({ heading, url }) => {
  it(
    `"${heading}" page has no detectable accessibility violations on load`,
    { retries: 1 },
    () => {
      if (url === "/intro/user") {
        cy.login({ shouldSkipIntro: false });
      } else if (url !== "/accounts/login") {
        cy.login();
      }
      const pageUrl = generateNewURL(url);

      cy.visit(pageUrl);
      cy.waitForPageToLoad();
      cy.findByRole("heading", { name: new RegExp(heading, "i") });

      cy.testA11y({ url, title: heading });
    }
  );
});
