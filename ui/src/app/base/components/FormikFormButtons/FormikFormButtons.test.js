import { shallow } from "enzyme";
import React from "react";

import FormikFormButtons from "./FormikFormButtons";

describe("FormikFormButtons ", () => {
  it("renders", () => {
    const wrapper = shallow(<FormikFormButtons submitLabel="Save user" />);
    expect(wrapper).toMatchSnapshot();
  });
});
