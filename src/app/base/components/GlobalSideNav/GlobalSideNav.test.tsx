import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { BrowserRouter, Router } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import GlobalSideNav from "./GlobalSideNav";

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
    renderWithBrowserRouter(<GlobalSideNav />, { route: "/", state });

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("can handle a logged out user", () => {
    state.user.auth.user = null;
    renderWithBrowserRouter(<GlobalSideNav />, {
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
            <GlobalSideNav />
          </CompatRouter>
        </BrowserRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "koala" }));
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    const expectedAction = statusActions.logout();
    await waitFor(() => {
      expect(
        store.getActions().find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction);
    });
  });

  it("hides nav links if not completed intro", async () => {
    state.user.auth.user = userFactory({
      completed_intro: false,
      username: "koala",
    });
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/",
      state,
    });

    const mainNav = screen.getByRole("navigation");
    expect(within(mainNav).getAllByRole("link")[0]).toHaveAccessibleName(
      "Homepage"
    );
    await userEvent.click(screen.getByRole("button", { name: "koala" }));
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("can highlight active URL", () => {
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/settings",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Settings");
  });

  it("highlights machines when active", () => {
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/machines",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights pools when active", () => {
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/pools",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Pools");
  });

  it("highlights tags when active", () => {
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/tags",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Tags");
  });

  it("highlights tags viewing a tag", () => {
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/tag/1",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Tags");
  });

  it("can highlight a url with a query param", () => {
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/networks?by=fabric",
      state,
    });

    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Subnets");
  });

  it("highlights sub-urls", () => {
    renderWithBrowserRouter(<GlobalSideNav />, {
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
    renderWithBrowserRouter(<GlobalSideNav />, { route: "/", state });

    const controllerLink = screen.getByRole("listitem", {
      name: "Controllers",
    });
    const warningIcon = within(controllerLink).getByTestId("warning-icon");
    expect(warningIcon).toHaveClass(
      "p-navigation--item-icon p-icon--security-warning-grey"
    );
  });

  it("does not display a warning icon next to controllers if vault is fully configured", () => {
    state.controller.items = [
      controllerFactory({ vault_configured: true }),
      controllerFactory({ vault_configured: true }),
    ];
    renderWithBrowserRouter(<GlobalSideNav />, { route: "/", state });

    const controllerLink = screen.getByRole("listitem", {
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
    renderWithBrowserRouter(<GlobalSideNav />, { route: "/", state });

    const controllerLink = screen.getByRole("listitem", {
      name: "Controllers",
    });
    expect(
      within(controllerLink).queryByTestId("warning-icon")
    ).not.toBeInTheDocument();
  });

  it("links from the logo to the dashboard for admins", () => {
    state.user.auth.user = userFactory({ is_superuser: true });
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/machine/abc123",
      state,
    });

    expect(screen.getByRole("link", { name: "Homepage" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("links from the logo to the machine list for non admins", () => {
    state.user.auth.user = userFactory({ is_superuser: false });
    renderWithBrowserRouter(<GlobalSideNav />, {
      route: "/machine/abc123",
      state,
    });

    expect(screen.getByRole("link", { name: "Homepage" })).toHaveAttribute(
      "href",
      "/machines"
    );
  });

  it("redirects to the intro page if intro not completed", () => {
    state.config.items = [
      configFactory({ name: ConfigNames.COMPLETED_INTRO, value: false }),
    ];
    state.user.auth.user = userFactory({ completed_intro: true });
    renderWithBrowserRouter(<GlobalSideNav />, {
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
    renderWithBrowserRouter(<GlobalSideNav />, {
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
              <Route element={<GlobalSideNav />} path="*" />
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
