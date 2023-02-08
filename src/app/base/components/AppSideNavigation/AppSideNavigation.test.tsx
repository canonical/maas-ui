import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { BrowserRouter, Router } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AppSideNavigation from "./AppSideNavigation";

import urls from "app/base/urls";
import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import {
  userEvent,
  screen,
  render,
  waitFor,
  within,
  act,
  renderWithBrowserRouter,
} from "testing/utils";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  useNavigate: () => mockUseNavigate,
}));

const mockStore = configureStore<RootState>();

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("GlobalSideNav", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.COMPLETED_INTRO, value: true }),
        ],
        loaded: true,
      }),
      controller: controllerStateFactory({
        items: [controllerFactory()],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({
            id: 99,
            is_superuser: true,
            completed_intro: true,
            username: "koala",
          }),
        }),
      }),
    });
  });

  it("renders", () => {
    renderWithBrowserRouter(<AppSideNavigation />, { route: "/", state });

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("can handle a logged out user", () => {
    state.user.auth.user = null;
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/",
      state,
    });

    const primaryNavigation = screen.getByRole("navigation");
    expect(within(primaryNavigation).getAllByRole("link")).toHaveLength(1);
    expect(
      within(primaryNavigation).getAllByRole("link")[0]
    ).toHaveAccessibleName("Homepage");
    expect(
      within(primaryNavigation).queryByRole("list")
    ).not.toBeInTheDocument();
  });

  it("can dispatch an action to log out", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CompatRouter>
            <AppSideNavigation />
          </CompatRouter>
        </BrowserRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    const expectedAction = statusActions.logout();
    await waitFor(() => {
      expect(
        store.getActions().find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction);
    });
  });

  it("hides nav links if not completed intro", () => {
    state.user.auth.user = userFactory({
      completed_intro: false,
      username: "koala",
    });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/",
      state,
    });

    const mainNav = screen.getByRole("navigation");
    expect(within(mainNav).getAllByRole("link")[0]).toHaveAccessibleName(
      "Homepage"
    );

    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("can highlight active URL", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/settings",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Settings");
  });

  it("highlights machines when active", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machines",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights pools when active", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/pools",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Pools");
  });

  it("highlights tags when active", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/tags",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Tags");
  });

  it("highlights tags viewing a tag", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/tag/1",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Tags");
  });

  it("can highlight a url with a query param", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/networks?by=fabric",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Subnets");
  });

  it("highlights sub-urls", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machine/abc123",
      state,
    });
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("displays a warning icon next to controllers if vault is not fully configured", () => {
    state.controller.items = [
      controllerFactory({ vault_configured: true }),
      controllerFactory({ vault_configured: false }),
    ];
    renderWithBrowserRouter(<AppSideNavigation />, { route: "/", state });

    const controllerLink = screen.getByRole("link", {
      name: /Controllers/i,
    });
    const warningIcon = within(controllerLink).getByTestId("warning-icon");
    expect(warningIcon).toHaveClass("p-icon--security-warning-grey");
  });

  it("does not display a warning icon next to controllers if vault is fully configured", () => {
    state.controller.items = [
      controllerFactory({ vault_configured: true }),
      controllerFactory({ vault_configured: true }),
    ];
    renderWithBrowserRouter(<AppSideNavigation />, { route: "/", state });

    const controllerLink = screen.getByRole("link", {
      name: "Controllers",
    });
    expect(
      within(controllerLink).queryByTestId("warning-icon")
    ).not.toBeInTheDocument();
  });

  it("does not display a warning icon next to controllers if vault setup has not started", () => {
    state.controller.items = [
      controllerFactory({ vault_configured: false }),
      controllerFactory({ vault_configured: false }),
    ];
    renderWithBrowserRouter(<AppSideNavigation />, { route: "/", state });

    const controllerLink = screen.getByRole("link", {
      name: "Controllers",
    });
    expect(
      within(controllerLink).queryByTestId("warning-icon")
    ).not.toBeInTheDocument();
  });

  it("links from the logo to the dashboard for admins", () => {
    state.user.auth.user = userFactory({ is_superuser: true });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machine/abc123",
      state,
    });
    expect(
      within(screen.getByRole("navigation")).getByRole("link", {
        name: "Homepage",
      })
    ).toHaveAttribute("href", "/dashboard");
    expect(
      within(screen.getByRole("banner")).getByRole("link", {
        name: "Homepage",
      })
    ).toHaveAttribute("href", "/dashboard");
  });

  it("links from the logo to the machine list for non admins", () => {
    state.user.auth.user = userFactory({ is_superuser: false });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machine/abc123",
      state,
    });

    expect(
      within(screen.getByRole("navigation")).getByRole("link", {
        name: "Homepage",
      })
    ).toHaveAttribute("href", "/machines");
    expect(
      within(screen.getByRole("banner")).getByRole("link", {
        name: "Homepage",
      })
    ).toHaveAttribute("href", "/machines");
  });

  it("redirects to the intro page if intro not completed", () => {
    state.config.items = [
      configFactory({ name: ConfigNames.COMPLETED_INTRO, value: false }),
    ];
    state.user.auth.user = userFactory({ completed_intro: true });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machines",
      state,
    });

    expect(mockUseNavigate.mock.calls[0][0].pathname).toBe(urls.intro.index);
  });

  it("redirects to the user intro page if user intro not completed", () => {
    state.config.items = [
      configFactory({ name: ConfigNames.COMPLETED_INTRO, value: true }),
    ];
    state.user.auth.user = userFactory({ completed_intro: false });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machines",
      state,
    });

    expect(mockUseNavigate.mock.calls[0][0].pathname).toBe(urls.intro.user);
  });

  it("does not redirect if the intro is being displayed", async () => {
    state.config.items = [
      configFactory({ name: ConfigNames.COMPLETED_INTRO, value: false }),
    ];
    const history = createMemoryHistory({
      initialEntries: [{ pathname: "/" }],
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Router history={history}>
          <CompatRouter>
            <Routes>
              <Route element={<AppSideNavigation />} path="*" />
            </Routes>
          </CompatRouter>
        </Router>
      </Provider>
    );
    act(() => history.push(urls.intro.images));
    await waitFor(() =>
      expect(history.location.pathname).toBe(urls.intro.images)
    );
  });
});
