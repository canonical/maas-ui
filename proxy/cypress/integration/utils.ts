import { customAlphabet } from "nanoid";

import { BASENAME, REACT_BASENAME } from "@maas-ui/maas-ui-shared";

const nanoid = customAlphabet("1234567890abcdefghi", 10);

export const login = () => {
  cy.request({
    method: "POST",
    url: `${BASENAME}/accounts/login/`,
    form: true,
    body: {
      username: "admin",
      password: "test",
    },
  });
};

export const generateMac = () =>
  "XX:XX:XX:XX:XX:XX".replace(/X/g, () =>
    "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  );

export const generateEmail = () => `${nanoid()}@example.com`;

export const makeUIURL = (path: string) => {
  return [`${BASENAME}${REACT_BASENAME}`, path].join(
    path.startsWith("/") ? "" : "/"
  );
};
