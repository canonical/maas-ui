import { mount } from "enzyme";
import type { RouteProps } from "react-router-dom";
import { MemoryRouter, Route } from "react-router-dom";

import type { NavItem } from "./SideNav";
import { SideNav } from "./SideNav";

describe("SideNav", () => {
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
  it("renders", () => {
    const wrapper = mount(
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
    expect(wrapper.find("SideNav")).toMatchSnapshot();
  });

  it("can set an active item", () => {
    const wrapper = mount(
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
    expect(wrapper.find("a.is-active").text()).toEqual("Users");
  });
});
