import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { RouteProps } from "react-router-dom";
import { MemoryRouter, Route } from "react-router-dom";

import type { NavItem } from "./SideNav";
import { SideNav } from "./SideNav";

let items: NavItem[];

beforeEach(() => {
  items = [
    {
      label: "Configuration",
      subNav: [
        { path: "/settings/configuration/general", label: "General" },
        {
          path: "/settings/configuration/commissioning",
          label: "Commissioning",
        },
        { path: "/settings/configuration/deploy", label: "Deploy" },
        {
          path: "/settings/configuration/kernel-parameters",
          label: "Kernel parameters",
        },
      ],
    },
    {
      path: "/settings/users",
      label: "Users",
    },
  ];
});

it("matches the snapshot", () => {
  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/settings", key: "testKey" }]}
      initialIndex={0}
    >
      <Route
        render={(props: RouteProps) => <SideNav {...props} items={items} />}
        path="/settings"
      />
    </MemoryRouter>
  );

  expect(screen.getByRole("navigation")).toMatchSnapshot();
});

it("can set an active item", () => {
  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
      initialIndex={0}
    >
      <Route
        render={(props: RouteProps) => <SideNav {...props} items={items} />}
        path="/settings"
      />
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: "Users" })).toHaveClass("is-active");
});

it("can be given different toggle texts", () => {
  render(
    <MemoryRouter>
      <SideNav
        closeToggleText="Get me out!"
        items={items}
        openToggleText="Let me in!"
      />
    </MemoryRouter>
  );

  expect(screen.getByTestId("sidenav-toggle-open").textContent).toBe(
    "Let me in!"
  );
  expect(screen.getByTestId("sidenav-toggle-close").textContent).toBe(
    "Get me out!"
  );
});

it("can open and close the navigation drawer by clicking the toggles", async () => {
  render(
    <MemoryRouter>
      <SideNav items={items} />
    </MemoryRouter>
  );
  const nav = screen.getByRole("navigation");

  // The collapsed class is only applied after the navigation has expanded at
  // least once.
  expect(nav).not.toHaveClass("is-collapsed");
  expect(nav).not.toHaveClass("is-expanded");

  await userEvent.click(screen.getByTestId("sidenav-toggle-open"));

  expect(nav).not.toHaveClass("is-collapsed");
  expect(nav).toHaveClass("is-expanded");

  await userEvent.click(screen.getByTestId("sidenav-toggle-close"));

  expect(nav).toHaveClass("is-collapsed");
  expect(nav).not.toHaveClass("is-expanded");
});

it("can close the navigation drawer by pressing the esc key", async () => {
  render(
    <MemoryRouter>
      <SideNav items={items} />
    </MemoryRouter>
  );
  const nav = screen.getByRole("navigation");

  await userEvent.click(screen.getByTestId("sidenav-toggle-open"));

  expect(nav).not.toHaveClass("is-collapsed");
  expect(nav).toHaveClass("is-expanded");

  await userEvent.keyboard("{Escape}");

  expect(nav).toHaveClass("is-collapsed");
  expect(nav).not.toHaveClass("is-expanded");
});
