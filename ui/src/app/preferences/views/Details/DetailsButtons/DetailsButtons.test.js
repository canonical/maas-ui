import { shallow } from "enzyme";
import React from "react";

import DetailsButtons from "./DetailsButtons";

describe("DetailsButtons ", () => {
  it("renders", () => {
    const wrapper = shallow(<DetailsButtons actionLabel="Save user" />);
    expect(wrapper).toMatchSnapshot();
  });
});
