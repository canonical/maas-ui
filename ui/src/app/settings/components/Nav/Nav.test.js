import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import React from "react";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <Nav />
      </MemoryRouter>
    );
    expect(wrapper.find("Nav")).toMatchSnapshot();
  });

  it("can set an active item", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: "/users" }]}>
        <Nav />
      </MemoryRouter>
    );
    expect(wrapper.find(".is-active Link").prop("children")).toEqual("Users");
  });
});
