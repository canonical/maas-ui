import { shallow } from "enzyme";
import React from "react";

import FormikFormButtons from "./FormikFormButtons";

describe("FormikFormButtons ", () => {
  it("renders", () => {
    const wrapper = shallow(<FormikFormButtons actionLabel="Save user" />);
    expect(wrapper).toMatchSnapshot();
  });
});
