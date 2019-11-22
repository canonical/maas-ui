import { mount, shallow } from "enzyme";
import React from "react";

import Tooltip from "./Tooltip";

describe("<Tooltip />", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  app.setAttribute("id", "app");
  body.appendChild(app);

  // snapshot tests
  it("renders and matches the snapshot", () => {
    const component = shallow(<Tooltip message="text">Child</Tooltip>);
    expect(component).toMatchSnapshot();
  });

  // unit tests
  it("does not show tooltip message by default", () => {
    const component = mount(<Tooltip message="text">Child</Tooltip>);
    expect(component.exists(".p-tooltip__message--portal")).toEqual(false);
  });

  it("renders tooltip message when focused", () => {
    const component = mount(<Tooltip message="text">Child</Tooltip>);
    component.simulate("focus");
    expect(component.find(".p-tooltip__message--portal").text()).toEqual(
      "text"
    );
  });

  it("gives the correct class name to the tooltip", () => {
    const component = mount(
      <Tooltip message="text" position="top-left">
        Child
      </Tooltip>
    );
    component.simulate("focus");
    expect(component.exists(".p-tooltip--top-left")).toEqual(true);
  });
});
