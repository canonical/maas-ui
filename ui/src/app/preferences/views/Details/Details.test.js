import { shallow } from "enzyme";
import React from "react";

import { Details } from "./Details";

describe("Details", () => {
  it("renders", () => {
    const wrapper = shallow(<Details />);
    expect(wrapper).toMatchSnapshot();
  });
});
