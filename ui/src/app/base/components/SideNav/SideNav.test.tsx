import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import React from "react";

import { SideNav } from "./SideNav";
import { SideNavSection } from "./types";

describe("SideNav", () => {
  let sectionList: Array<SideNavSection>;

  beforeEach(() => {
    sectionList = [
      {
        label: "Configuration",
        subNav: [
          { path: "configuration/general", label: "General" },
          {
            path: "configuration/commissioning",
            label: "Commissioning"
          },
          { path: "configuration/deploy", label: "Deploy" },
          {
            path: "configuration/kernel-parameters",
            label: "Kernel parameters"
          }
        ]
      },
      {
        path: "users",
        label: "Users"
      }
    ];
  });

  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        initialIndex={0}
      >
        <Route path="/settings">
          <SideNav sectionList={sectionList} />
        </Route>
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
        <Route path="/settings">
          <SideNav sectionList={sectionList} />
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(".is-active Link").prop("children")).toEqual("Users");
  });
});
