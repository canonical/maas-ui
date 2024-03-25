import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  Router,
  CompatRouter,
  Route,
  Routes,
} from "react-router-dom";
import configureStore from "redux-mock-store";

import AppSideNavigation from "./AppSideNavigation";

import urls from "@/app/base/urls";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import { statusActions } from "@/app/store/status";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  waitFor,
  within,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual: object = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

const mockStore = configureStore<RootState>();

afterEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
});

describe("GlobalSideNav", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({ name: ConfigNames.COMPLETED_INTRO, value: true }),
        ],
        loaded: true,
      }),
      controller: factory.controllerState({
        items: [factory.controller()],
        loaded: true,
      }),
      pod: factory.podState({
        loaded: true,
        items: [
          factory.pod({
            type: "virsh",
          }),
        ],
      }),
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({
            id: 99,
            is_superuser: true,
            completed_intro: true,
            username: "koala",
          }),
        }),
      }),
    });
  });

  it("displays navigation", () => {
    renderWithBrowserRouter(<AppSideNavigation />, { route: "/", state });

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("can handle a logged out user", () => {
    state.user.auth.user = null;
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/",
      state,
    });

    const primaryNavigation = screen.getByRole("banner", {
      name: "main navigation",
    });
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
    state.user.auth.user = factory.user({
      completed_intro: false,
      username: "koala",
    });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/",
      state,
    });

    const mainNav = screen.getByRole("banner", { name: "main navigation" });
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

    // Ensure that machine link is selected from within the nav
    const sideNavigation = screen.getAllByRole("navigation")[0];
    const currentMenuItem = within(sideNavigation).getAllByRole("link", {
      current: "page",
    })[0];
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
      factory.controller({ vault_configured: true }),
      factory.controller({ vault_configured: false }),
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
      factory.controller({ vault_configured: true }),
      factory.controller({ vault_configured: true }),
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
      factory.controller({ vault_configured: false }),
      factory.controller({ vault_configured: false }),
    ];
    renderWithBrowserRouter(<AppSideNavigation />, { route: "/", state });

    const controllerLink = screen.getByRole("link", {
      name: "Controllers",
    });
    expect(
      within(controllerLink).queryByTestId("warning-icon")
    ).not.toBeInTheDocument();
  });

  it("links from the logo to machine list page for admins", () => {
    state.user.auth.user = factory.user({ is_superuser: true });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machine/abc123",
      state,
    });
    expect(
      within(screen.getByRole("banner", { name: "main navigation" })).getByRole(
        "link",
        {
          name: "Homepage",
        }
      )
    ).toHaveAttribute("href", "/machines");
  });

  it("links from the logo to the machine list for non admins", () => {
    state.user.auth.user = factory.user({ is_superuser: false });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machine/abc123",
      state,
    });

    expect(
      within(screen.getByRole("banner", { name: "main navigation" })).getByRole(
        "link",
        {
          name: "Homepage",
        }
      )
    ).toHaveAttribute("href", "/machines");
    expect(
      within(screen.getByRole("banner", { name: "main navigation" })).getByRole(
        "link",
        {
          name: "Homepage",
        }
      )
    ).toHaveAttribute("href", "/machines");
  });

  it("redirects to the intro page if intro not completed", () => {
    state.config.items = [
      factory.config({ name: ConfigNames.COMPLETED_INTRO, value: false }),
    ];
    state.user.auth.user = factory.user({ completed_intro: true });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machines",
      state,
    });

    expect(mockUseNavigate.mock.calls[0][0].pathname).toBe(urls.intro.index);
  });

  it("redirects to the user intro page if user intro not completed", () => {
    state.config.items = [
      factory.config({ name: ConfigNames.COMPLETED_INTRO, value: true }),
    ];
    state.user.auth.user = factory.user({ completed_intro: false });
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machines",
      state,
    });

    expect(mockUseNavigate.mock.calls[0][0].pathname).toBe(urls.intro.user);
  });

  it("does not redirect if the intro is being displayed", async () => {
    state.config.items = [
      factory.config({ name: ConfigNames.COMPLETED_INTRO, value: false }),
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
    history.push(urls.intro.images);
    await waitFor(() =>
      expect(history.location.pathname).toBe(urls.intro.images)
    );
  });

  it("hides the 'Virsh' link if the user does not have any Virsh KVM hosts", () => {
    const { rerender } = renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/machines",
      state,
    });

    expect(screen.getByRole("link", { name: "Virsh" })).toBeInTheDocument();

    state.pod.items = [];

    rerender(<AppSideNavigation />);

    expect(
      screen.queryByRole("link", { name: "Virsh" })
    ).not.toBeInTheDocument();
  });

  it("is collapsed by default", () => {
    renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/",
      state,
    });

    expect(screen.getByRole("banner", { name: "main navigation" })).toHaveClass(
      "is-collapsed"
    );
  });

  it("persists collapsed state", async () => {
    state.user.auth.user = null;
    const { rerender } = renderWithBrowserRouter(<AppSideNavigation />, {
      route: "/",
      state,
    });

    const primaryNavigation = screen.getByRole("banner", {
      name: "main navigation",
    });
    await userEvent.click(
      screen.getByRole("button", { name: "expand main navigation" })
    );
    expect(primaryNavigation).toHaveClass("is-pinned");
    rerender(<AppSideNavigation />);
    expect(primaryNavigation).toHaveClass("is-pinned");
  });
});
