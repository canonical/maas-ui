import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { Header } from "./Header";
import { GenerateLinkType } from "./types";

describe("Header", () => {
  let generateURL: GenerateLinkType;

  beforeEach(() => {
    generateURL = (link, props, _appendNewBase) => (
      <a
        className={props.className}
        aria-current={props["aria-current"]}
        aria-label={props["aria-label"]}
        role={props.role}
        href={link.url}
        onClick={jest.fn}
      >
        {link.label}
      </a>
    );
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />
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
    render(
      <Header
        authUser={null}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "primary" })
    ).not.toBeInTheDocument();
  });

  it("can handle logging out", () => {
    const logout = jest.fn();
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={logout}
      />
    );
    userEvent.click(screen.getByRole("link", { name: "Log out" }));
    expect(logout).toHaveBeenCalled();
  });

  it("hides nav links if not completed intro", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={false}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    expect(screen.getByRole("list", { name: "main" })).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "main" })).queryByRole("link")
    ).not.toBeInTheDocument();
  });

  it("can highlight active URL", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/MAAS/r/settings",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getByRole("link", { current: "page" });
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Settings");
  });

  it("can highlight a legacy URL", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/MAAS/l/devices",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getByRole("link", { current: "page" });
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Devices");
  });

  it("can highlight a url with a query param", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateNewLink={generateURL}
        location={
          {
            search: "?by=fabric",
            pathname: "/MAAS/l/networks",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getByRole("link", { current: "page" });
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Subnets");
  });

  it("highlights sub-urls", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/MAAS/l/machine/abc123",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getByRole("link", { current: "page" });
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("links from the logo to the dashboard for admins", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/dashboard",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    expect(screen.getByRole("link", { name: "Homepage" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("links from the logo to the machine list for non admins", () => {
    render(
      <Header
        authUser={{
          id: 99,
          is_superuser: false,
          username: "koala",
        }}
        completedIntro={true}
        generateNewLink={generateURL}
        location={
          {
            pathname: "/",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    expect(screen.getByRole("link", { name: "Homepage" })).toHaveAttribute(
      "href",
      "/machines"
    );
  });
});
