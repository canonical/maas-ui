import { shallow } from "enzyme";
import React from "react";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Nav location={{ pathname: "/", hash: "", search: "" }} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can set an active item", () => {
    const wrapper = shallow(
      <Nav location={{ pathname: "/users", hash: "", search: "" }} />
    );
    expect(wrapper.find(".is-active Link").prop("children")).toEqual("Users");
  });
});
