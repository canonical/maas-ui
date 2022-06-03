import { generateNewURL } from "@maas-ui/maas-ui-shared";
import { pages } from "../constants";

pages.forEach(({ heading, url }) => {
  it(`"Loads the ${heading}" page`, () => {
    if (url === "/intro/user") {
      cy.login({ shouldSkipIntro: false });
    } else if (url !== "/accounts/login") {
      cy.login();
    }
    const pageUrl = generateNewURL(url);
    cy.visit(pageUrl);
    cy.waitForPageToLoad();
    cy.percySnapshot(heading);
  });
});
