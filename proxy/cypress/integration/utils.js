export const login = () => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("BASENAME")}/accounts/login/`,
    form: true,
    body: {
      username: "admin",
      password: "test",
    },
  })
};



export const generateMac = () =>
  "XX:XX:XX:XX:XX:XX".replace(/X/g, () =>
    "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  );
