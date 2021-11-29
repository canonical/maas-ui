import { shallow } from "enzyme";

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
    expect(wrapper.find("[data-testid='section-header-title']").text()).toBe(
      "Title"
    );
    expect(wrapper.find("[data-testid='section-header-subtitle']").text()).toBe(
      "Subtitle"
    );
  });

  it("shows a spinner instead of title if loading", () => {
    const wrapper = shallow(
      <SectionHeader title="Title" subtitle="Subtitle" loading />
    );
    expect(
      wrapper.find("[data-testid='section-header-title-spinner']").exists()
    ).toBe(true);
    expect(wrapper.find("[data-testid='section-header-title']").exists()).toBe(
      false
    );
  });

  it("shows a spinner instead of subtitle if subtitle loading", () => {
    const wrapper = shallow(
      <SectionHeader title="Title" subtitle="Subtitle" subtitleLoading />
    );
    expect(
      wrapper.find("[data-testid='section-header-subtitle']").text()
    ).not.toBe("Subtitle");
    expect(
      wrapper.find("[data-testid='section-header-subtitle'] Spinner").exists()
    ).toBe(true);
  });

  it("can render buttons", () => {
    const buttons = [
      <button key="button-1">Button 1</button>,
      <button key="button-2">Button 2</button>,
    ];
    const wrapper = shallow(<SectionHeader title="Title" buttons={buttons} />);
    expect(
      wrapper.find("[data-testid='section-header-buttons']").exists()
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
    expect(wrapper.find("[data-testid='section-header-tabs']").exists()).toBe(
      true
    );
  });

  it("can render extra header content", () => {
    const wrapper = shallow(
      <SectionHeader title="Title" headerContent={<div>Header content</div>} />
    );
    expect(
      wrapper.find("[data-testid='section-header-content']").exists()
    ).toBe(true);
  });

  it("does not render subtitle or buttons if header content is present", () => {
    const wrapper = shallow(
      <SectionHeader
        buttons={[<button key="button">Click me</button>]}
        subtitle="subtitle"
        title="Title"
      />
    );
    expect(
      wrapper.find("[data-testid='section-header-buttons']").exists()
    ).toBe(true);
    expect(
      wrapper.find("[data-testid='section-header-subtitle']").exists()
    ).toBe(true);

    wrapper.setProps({ headerContent: <div>Header content</div> });
    expect(
      wrapper.find("[data-testid='section-header-buttons']").exists()
    ).toBe(false);
    expect(
      wrapper.find("[data-testid='section-header-subtitle']").exists()
    ).toBe(false);
  });
});
