import { shallow } from "enzyme";
import React from "react";

import ActionButton from "./ActionButton";

describe("ActionButton", () => {
  it("matches loading snapshot", () => {
    const wrapper = shallow(<ActionButton loading>Click me</ActionButton>);
    expect(wrapper).toMatchSnapshot();
  });

  it("matches success snapshot", () => {
    const wrapper = shallow(<ActionButton success>Click me</ActionButton>);
    expect(wrapper).toMatchSnapshot();
  });

  it("correctly shows a positive tick if appearance is positive and successful", () => {
    const wrapper = shallow(
      <ActionButton appearance="positive" success>
        Click me
      </ActionButton>
    );
    expect(wrapper.find(".p-icon--success-positive").exists()).toBe(true);
  });
});
