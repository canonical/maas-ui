import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Header } from "./Header";

import { rootState as rootStateFactory } from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("Header", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/", wrapperProps: { state: rootStateFactory() } }
    );

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
    renderWithBrowserRouter(
      <Header
        authUser={null}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/", wrapperProps: { state: rootStateFactory() } }
    );
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

  it("can handle logging out", async () => {
    const logout = jest.fn();
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={logout}
      />,
      { route: "/", wrapperProps: { state: rootStateFactory() } }
    );
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(logout).toHaveBeenCalled();
  });

  it("hides nav links if not completed intro", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={false}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/", wrapperProps: { state: rootStateFactory() } }
    );
    const mainNav = screen.getByRole("list", { name: "main" });
    expect(within(mainNav).queryByRole("link")).not.toBeInTheDocument();
    const userNav = screen.getByRole("list", { name: "user" });
    expect(within(userNav).queryByRole("link")).not.toBeInTheDocument();
    expect(
      within(userNav).getByRole("button", { name: "Log out" })
    ).toBeInTheDocument();
  });

  it("can highlight active URL", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/settings",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/settings", wrapperProps: { state: rootStateFactory() } }
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Settings");
  });

  it("highlights machines when active", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/machines",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/machines", wrapperProps: { state: rootStateFactory() } }
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights machines viewing pools", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/pools",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/pools", wrapperProps: { state: rootStateFactory() } }
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights machines viewing tags", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/tags",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/tags", wrapperProps: { state: rootStateFactory() } }
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights machines viewing a tag", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/tag/1",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/tag/1", wrapperProps: { state: rootStateFactory() } }
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("can highlight a url with a query param", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            search: "?by=fabric",
            pathname: "/networks",
          } as Location
        }
        logout={jest.fn()}
      />,
      {
        route: "/networks?by=fabric",
        wrapperProps: { state: rootStateFactory() },
      }
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Subnets");
  });

  it("highlights sub-urls", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/machine/abc123",
          } as Location
        }
        logout={jest.fn()}
      />,
      {
        route: "/machine/abc123",
        wrapperProps: { state: rootStateFactory() },
      }
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("links from the logo to the dashboard for admins", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/dashboard",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/dashboard", wrapperProps: { state: rootStateFactory() } }
    );
    expect(screen.getByRole("link", { name: "Homepage" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("links from the logo to the machine list for non admins", () => {
    renderWithBrowserRouter(
      <Header
        authUser={{
          id: 99,
          is_superuser: false,
          username: "koala",
        }}
        completedIntro={true}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />,
      { route: "/", wrapperProps: { state: rootStateFactory() } }
    );
    expect(screen.getByRole("link", { name: "Homepage" })).toHaveAttribute(
      "href",
      "/machines"
    );
  });
});
