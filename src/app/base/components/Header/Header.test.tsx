import { screen, render, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { BrowserRouter, Router } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Header } from "./Header";

import urls from "app/base/urls";
import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  useNavigate: () => mockUseNavigate,
}));
const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    config: configStateFactory({
      items: [
        configFactory({ name: ConfigNames.COMPLETED_INTRO, value: true }),
      ],
      loaded: true,
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

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

it("renders", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/",
    wrapperProps: { state },
  });

  // header has a role of banner in this context
  // https://www.w3.org/TR/html-aria/#el-header
  expect(screen.getByRole("banner")).toBeInTheDocument();
  const primaryNavigation = screen.getByRole("navigation", {
    name: "primary",
  });
  expect(primaryNavigation).toBeInTheDocument();
  expect(
    within(primaryNavigation).getByRole("list", {
      name: "main",
    })
  ).toBeInTheDocument();
  expect(
    within(primaryNavigation).getByRole("list", {
      name: "user",
    })
  ).toBeInTheDocument();
});

it("can handle a logged out user", () => {
  state.user.auth.user = null;
  renderWithBrowserRouter(<Header />, {
    route: "/",
    wrapperProps: { state },
  });

  expect(screen.getByRole("banner")).toBeInTheDocument();
  const primaryNavigation = screen.getByRole("navigation", {
    name: "primary",
  });
  const mainNav = screen.getByRole("list", {
    name: "main",
  });
  expect(within(mainNav).queryByRole("link")).not.toBeInTheDocument();
  expect(
    within(primaryNavigation).queryByRole("list", {
      name: "user",
    })
  ).not.toBeInTheDocument();
});

it("can dispatch an action to log out", async () => {
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CompatRouter>
          <Header />
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
  state.user.auth.user = userFactory({ completed_intro: false });
  renderWithBrowserRouter(<Header />, {
    route: "/",
    wrapperProps: { state },
  });

  const mainNav = screen.getByRole("list", { name: "main" });
  expect(within(mainNav).queryByRole("link")).not.toBeInTheDocument();
  const userNav = screen.getByRole("list", { name: "user" });
  expect(within(userNav).queryByRole("link")).not.toBeInTheDocument();
  expect(
    within(userNav).getByRole("button", { name: "Log out" })
  ).toBeInTheDocument();
});

it("can highlight active URL", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/settings",
    wrapperProps: { state },
  });

  const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
  expect(currentMenuItem).toBeInTheDocument();
  expect(currentMenuItem).toHaveTextContent("Settings");
});

it("highlights machines when active", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/machines",
    wrapperProps: { state },
  });

  const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
  expect(currentMenuItem).toBeInTheDocument();
  expect(currentMenuItem).toHaveTextContent("Machines");
});

it("highlights machines viewing pools", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/pools",
    wrapperProps: { state },
  });

  const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
  expect(currentMenuItem).toBeInTheDocument();
  expect(currentMenuItem).toHaveTextContent("Machines");
});

it("highlights machines viewing tags", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/tags",
    wrapperProps: { state },
  });

  const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
  expect(currentMenuItem).toBeInTheDocument();
  expect(currentMenuItem).toHaveTextContent("Machines");
});

it("highlights machines viewing a tag", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/tag/1",
    wrapperProps: { state },
  });

  const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
  expect(currentMenuItem).toBeInTheDocument();
  expect(currentMenuItem).toHaveTextContent("Machines");
});

it("can highlight a url with a query param", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/networks?by=fabric",
    wrapperProps: { state },
  });

  const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
  expect(currentMenuItem).toBeInTheDocument();
  expect(currentMenuItem).toHaveTextContent("Subnets");
});

it("highlights sub-urls", () => {
  renderWithBrowserRouter(<Header />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });
  const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
  expect(currentMenuItem).toBeInTheDocument();
  expect(currentMenuItem).toHaveTextContent("Machines");
});

it("links from the logo to the dashboard for admins", () => {
  state.user.auth.user = userFactory({ is_superuser: true });
  renderWithBrowserRouter(<Header />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  expect(screen.getByRole("link", { name: "Homepage" })).toHaveAttribute(
    "href",
    "/dashboard"
  );
});

it("links from the logo to the machine list for non admins", () => {
  state.user.auth.user = userFactory({ is_superuser: false });
  renderWithBrowserRouter(<Header />, {
    route: "/machine/abc123",
    wrapperProps: { state },
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
  renderWithBrowserRouter(<Header />, {
    route: "/machines",
    wrapperProps: { state },
  });

  expect(mockUseNavigate.mock.calls[0][0].pathname).toBe(urls.intro.index);
});

it("redirects to the user intro page if user intro not completed", () => {
  state.config.items = [
    configFactory({ name: ConfigNames.COMPLETED_INTRO, value: true }),
  ];
  state.user.auth.user = userFactory({ completed_intro: false });
  renderWithBrowserRouter(<Header />, {
    route: "/machines",
    wrapperProps: { state },
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
            <Route element={<Header />} path="*" />
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
