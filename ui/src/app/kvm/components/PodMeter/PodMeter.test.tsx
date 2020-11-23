import React from "react";

import { shallow } from "enzyme";

import PodMeter from "./PodMeter";

describe("PodMeter", () => {
  it("renders", () => {
    const wrapper = shallow(<PodMeter allocated={2} free={1} unit="GB" />);

    expect(wrapper).toMatchSnapshot();
  });
});
