import React from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { GenerateLink } from "../Navigation";

import { Header } from "./Header";

describe("Header", () => {
  let generateURL: GenerateLink;

  beforeEach(() => {
    generateURL = ({ url, label, isSelected, ...props }) => (
      <a {...props} href={url}>
        {label}
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
    const primaryNavigation = screen.getByRole("navigation", {
      name: "primary",
    });
    expect(
      within(primaryNavigation).queryByRole("list", {
        name: "main",
      })
    ).not.toBeInTheDocument();
    expect(
      within(primaryNavigation).queryByRole("list", {
        name: "user",
      })
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
    expect(
      screen.queryByRole("list", { name: "main" })
    ).not.toBeInTheDocument();
    const userLinks = within(
      screen.queryByRole("list", { name: "user" })
    ).getAllByRole("link");
    expect(userLinks.length).toBe(1);
    expect(userLinks[0].textContent).toBe("Log out");
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
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Settings");
  });

  it("highlights machines when active", () => {
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
            pathname: "/MAAS/r/machines",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights machines viewing pools", () => {
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
            pathname: "/MAAS/r/pools",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights machines viewing tags", () => {
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
            pathname: "/MAAS/r/tags",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
  });

  it("highlights machines viewing a tag", () => {
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
            pathname: "/MAAS/r/tag/1",
          } as Location
        }
        logout={jest.fn()}
      />
    );
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
    expect(currentMenuItem).toBeInTheDocument();
    expect(currentMenuItem).toHaveTextContent("Machines");
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
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
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
    const currentMenuItem = screen.getAllByRole("link", { current: "page" })[0];
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
