import { shallow } from "enzyme";
import React from "react";

import PodMeter from "./PodMeter";

describe("PodMeter", () => {
  it("renders", () => {
    const wrapper = shallow(<PodMeter allocated={2} free={1} unit="GB" />);

    expect(wrapper).toMatchSnapshot();
  });
});
