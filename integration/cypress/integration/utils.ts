import { BASENAME } from "@maas-ui/maas-ui-shared";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghi", 10);

export const login = () => {
  cy.request({
    method: "POST",
    url: `${BASENAME}/accounts/login/`,
    form: true,
    body: {
      username: Cypress.env("username"),
      password: Cypress.env("password"),
    },
  });
};

export const generateMac = () =>
  "XX:XX:XX:XX:XX:XX".replace(/X/g, () =>
    "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  );

export const generateEmail = () => `${nanoid()}@example.com`;
