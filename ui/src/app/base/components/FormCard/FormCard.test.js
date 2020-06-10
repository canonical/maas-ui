import { shallow } from "enzyme";
import React from "react";

import FormCard from "./FormCard";

describe("FormCard ", () => {
  it("renders", () => {
    const wrapper = shallow(<FormCard title="Add user" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("can display the heading on a separate row", () => {
    const wrapper = shallow(<FormCard stacked title="Add user" />);
    expect(wrapper.find("Col").exists()).toBe(false);
  });

  it("decreases col size if sidebar is present", () => {
    const withoutSidebar = shallow(
      <FormCard sidebar={false} title="Add user" />
    );
    const withSidebar = shallow(<FormCard sidebar title="Add user" />);
    expect(withoutSidebar.find("Col").at(1).props().size).toBe(10);
    expect(withSidebar.find("Col").at(1).props().size).toBe(7);
  });
});
