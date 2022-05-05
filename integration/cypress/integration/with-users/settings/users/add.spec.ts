import { customAlphabet } from "nanoid";
import { generateNewURL } from "@maas-ui/maas-ui-shared";

import { generateEmail } from "../../../utils";

const nanoid = customAlphabet("1234567890abcdefghi", 10);

context("Settings - User add", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/settings/users/add"));
  });

  it("can add a user", () => {
    const username = nanoid();
    const password = nanoid();
    cy.get("input[name='username']").type(username);
    cy.get("input[name='email']").type(generateEmail());
    cy.get("input[name='password']").type(password);
    cy.get("input[name='passwordConfirm']").type(password);
    cy.get("button[type='submit']").click();
    cy.get(`[data-testid='message']:contains(${username} added successfully.)`);
  });
});
