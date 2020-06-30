import { shallow } from "enzyme";
import React from "react";

import SectionHeader from "./SectionHeader";

describe("SectionHeader", () => {
  it("can render", () => {
    const wrapper = shallow(
      <SectionHeader title="Title" subtitle="Subtitle" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can render title and subtitle", () => {
    const wrapper = shallow(
      <SectionHeader title="Title" subtitle="Subtitle" />
    );
    expect(wrapper.find("[data-test='section-header-title']").text()).toBe(
      "Title"
    );
    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "Subtitle"
    );
  });

  it("shows a spinner instead of subtitle if loading", () => {
    const wrapper = shallow(
      <SectionHeader title="Title" subtitle="Subtitle" loading />
    );
    expect(wrapper.find("[data-test='section-header-subtitle']").exists()).toBe(
      false
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can render buttons", () => {
    const buttons = [
      <button key="button-1">Button 1</button>,
      <button key="button-2">Button 2</button>,
    ];
    const wrapper = shallow(<SectionHeader title="Title" buttons={buttons} />);
    expect(wrapper.find("[data-test='section-header-buttons']").exists()).toBe(
      true
    );
  });

  it("can render a form wrapper", () => {
    const wrapper = shallow(
      <SectionHeader title="Title" formWrapper={<div>Form wrapper</div>} />
    );
    expect(
      wrapper.find("[data-test='section-header-form-wrapper']").exists()
    ).toBe(true);
  });

  it("can render tabs", () => {
    const tabLinks = [
      {
        active: true,
        label: "Tab 1",
        path: "/path1",
      },
      {
        active: false,
        label: "Tab 2",
        path: "/path2",
      },
    ];
    const wrapper = shallow(
      <SectionHeader title="Title" tabLinks={tabLinks} />
    );
    expect(wrapper.find("[data-test='section-header-tabs']").exists()).toBe(
      true
    );
  });
});
