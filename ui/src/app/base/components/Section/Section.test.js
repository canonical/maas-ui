import { shallow } from "enzyme";
import React from "react";

import Section from "./Section";

describe("Section", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Section title="Settings" sidebar={<div>Sidebar</div>}>
        content
      </Section>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("renders without a sidebar", () => {
    const wrapper = shallow(<Section title="Settings">content</Section>);
    expect(wrapper.find(".section__sidebar").length).toEqual(0);
    expect(
      wrapper
        .find(".section__content")
        .prop("className")
        .includes("col-10")
    ).toBe(false);
  });
});
