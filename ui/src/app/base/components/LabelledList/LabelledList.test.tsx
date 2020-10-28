import { shallow } from "enzyme";
import React from "react";

import LabelledList from "./LabelledList";

describe("LabelledList ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <LabelledList items={[{ label: "Item", value: "Value" }]} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can add additional classes", () => {
    const wrapper = shallow(
      <LabelledList className="extra-class" items={[]} />
    );
    const className = wrapper.prop("className");
    expect(className.includes("p-list--labelled")).toBe(true);
    expect(className.includes("extra-class")).toBe(true);
  });
});
