import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import React from "react";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        initialIndex={0}
      >
        <Route component={props => <Nav {...props} />} path="/settings" />
      </MemoryRouter>
    );
    expect(wrapper.find("Nav")).toMatchSnapshot();
  });

  it("can set an active item", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        initialIndex={0}
      >
        <Route component={props => <Nav {...props} />} path="/settings" />
      </MemoryRouter>
    );
    expect(wrapper.find(".is-active Link").prop("children")).toEqual("Users");
  });
});
