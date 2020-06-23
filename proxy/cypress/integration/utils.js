import Cookies from "js-cookie";

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

/*
  const csrfToken = encodeURIComponent(Cookies.get("csrftoken"));
  const wsUrl = `${Cypress.env("BASENAME")}/ws?csrftoken=${csrfToken}`;
  const websocket = new WebSocket(wsUrl);

  websocket.onopen = () => {
      websocket.send(JSON.stringify({
        type: 0
      }))
    var msg = {
        request_id: id,
        type: 0,
        method,
      };

      window.legacyWS.send(JSON.stringify(msg))
  }
  */
};



export const generateMac = () =>
  "XX:XX:XX:XX:XX:XX".replace(/X/g, () =>
    "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  );
