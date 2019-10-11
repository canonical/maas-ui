import { shallow } from "enzyme";
import React from "react";

import NotFound from "./NotFound";

describe("NotFound ", () => {
  it("can render", () => {
    const wrapper = shallow(<NotFound />);
    expect(wrapper).toMatchSnapshot();
  });

  it("can render in a section", () => {
    const wrapper = shallow(<NotFound includeSection />);
    expect(wrapper.find("Section").exists()).toBe(true);
  });
});
