import Login, { Labels } from "./Login";

import type { RootState } from "@/app/store/root/types";
import { statusActions } from "@/app/store/status";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

describe("Login", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      status: factory.statusState({
        externalAuthURL: null,
      }),
    });
  });

  it("can display a login error message", () => {
    const authenticationError =
      "Please enter a correct username and password. Note that both fields may be case-sensitive.";
    state.status.authenticationError = authenticationError;
    renderWithProviders(<Login />, { initialEntries: ["/login"], state });
    expect(screen.getByRole("alert")).toHaveTextContent(authenticationError);
  });

  it("can render api login", () => {
    renderWithProviders(<Login />, { initialEntries: ["/login"], state });

    expect(
      screen.getByRole("form", { name: Labels.APILoginForm })
    ).toBeInTheDocument();
  });

  it("can render external login link", () => {
    state.status.externalAuthURL = "http://login.example.com";
    renderWithProviders(<Login />, { initialEntries: ["/login"], state });

    expect(
      screen.getByRole("link", { name: Labels.ExternalLoginButton })
    ).toBeInTheDocument();
  });

  it("hides the password field when a username has not been entered", async () => {
    renderWithProviders(<Login />, { initialEntries: ["/login"], state });

    expect(
      screen.getByRole("textbox", { name: Labels.Username })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(Labels.Password)).not.toBeInTheDocument();
  });

  it("shows the password field and hides the username field after entering a username and clicking 'Next'", async () => {
    renderWithProviders(<Login />, { initialEntries: ["/login"], state });

    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.Username }),
      "koala"
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByLabelText(Labels.Password)).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: Labels.Username })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Login");
  });

  it("can login via the api", async () => {
    const { store } = renderWithProviders(<Login />, {
      initialEntries: ["/login"],
      state,
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.Username }),
      "koala"
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.type(screen.getByLabelText(Labels.Password), "gumtree");
    await userEvent.click(screen.getByRole("button", { name: Labels.Submit }));

    const expectedAction = statusActions.login({
      username: "koala",
      password: "gumtree",
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("shows a warning if no users have been added yet", () => {
    state.status.noUsers = true;
    renderWithProviders(<Login />, { initialEntries: ["/login"], state });

    expect(
      screen.getByRole("heading", { name: Labels.NoUsers })
    ).toBeInTheDocument();
  });

  it("redirects to machines after login", async () => {
    state.status.authenticated = true;
    const { router } = renderWithProviders(<Login />, {
      initialEntries: ["/login"],
      state,
    });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/machines");
    });
  });
});
