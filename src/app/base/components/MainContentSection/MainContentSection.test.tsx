import { shallow } from "enzyme";

import MainContentSection from "./MainContentSection";

describe("MainContentSection", () => {
  it("renders", () => {
    const wrapper = shallow(
      <MainContentSection header="Settings" sidebar={<div>Sidebar</div>}>
        content
      </MainContentSection>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("renders without a sidebar", () => {
    const wrapper = shallow(
      <MainContentSection header="Settings">content</MainContentSection>
    );
    expect(wrapper.find(".section__sidebar").length).toEqual(0);
    expect(wrapper.find(".section__content").at(0).hasClass("col-10")).toBe(
      false
    );
  });

  it("can render a node as a title", () => {
    const wrapper = shallow(
      <MainContentSection header={<span data-testid="test">Node title</span>}>
        content
      </MainContentSection>
    );
    expect(wrapper.find('[data-testid="test"]').text()).toEqual("Node title");
  });
});
