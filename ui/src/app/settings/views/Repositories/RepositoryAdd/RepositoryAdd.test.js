import { mount } from "enzyme";
import React from "react";

import RepositoryAdd from "./RepositoryAdd";

describe("RepositoryAdd", () => {
  it("can render", () => {
    const wrapper = mount(<RepositoryAdd />);
    expect(wrapper).toMatchSnapshot();
  });
});
