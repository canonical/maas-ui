import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghi", 10);

export const clearCookies = () => {
  cy.clearCookie("skipsetupintro");
  cy.clearCookie("skipintro");
};

export const generateMac = () =>
  "XX:XX:XX:XX:XX:XX".replace(/X/g, () =>
    "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  );

export const generateEmail = () => `${nanoid()}@example.com`;
