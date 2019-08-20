import { shallow } from "enzyme";
import React from "react";

import RepositoryForm from "./RepositoryForm";

describe("RepositoryForm", () => {
  it("can render", () => {
    const wrapper = shallow(<RepositoryForm title="Add repository" />);
    expect(wrapper).toMatchSnapshot();
  });
});
