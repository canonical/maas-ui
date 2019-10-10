import { shallow } from "enzyme";
import React from "react";

import NotFound from "./NotFound";

describe("NotFound ", () => {
  it("can render", () => {
    const wrapper = shallow(<NotFound />);
    expect(wrapper).toMatchSnapshot();
  });
});
