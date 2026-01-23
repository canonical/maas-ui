import Login, { Labels, INCORRECT_CREDENTIALS_ERROR_MESSAGE } from "./Login";

import type { RootState } from "@/app/store/root/types";
import { setCookie } from "@/app/utils";
import { COOKIE_NAMES } from "@/app/utils/cookies";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

setupMockServer(authResolvers.authenticate.handler());

vi.mock("@/app/utils/cookies", () => ({
  setCookie: vi.fn(),
}));

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
    state.status.authenticationError = INCORRECT_CREDENTIALS_ERROR_MESSAGE;
    renderWithProviders(<Login />, { initialEntries: ["/login"], state });
    expect(screen.getByRole("alert")).toHaveTextContent(
      INCORRECT_CREDENTIALS_ERROR_MESSAGE
    );
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

    await waitFor(() => {
      expect(authResolvers.authenticate.resolved).toBeTruthy();
    });
    expect(setCookie).toHaveBeenCalledWith(
      COOKIE_NAMES.LOCAL_JWT_TOKEN_NAME,
      "mock_access_token",
      {
        sameSite: "Strict",
        path: "/",
      }
    );
    expect(
      store.getActions().find((action) => action.type === "status/loginSuccess")
    ).toBeDefined();
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
