import { shallow } from "enzyme";
import React from "react";

import FormCard from "./FormCard";

describe("FormCard ", () => {
  it("renders", () => {
    const wrapper = shallow(<FormCard title="Add user" />);
    expect(wrapper).toMatchSnapshot();
  });
});
