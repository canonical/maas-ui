import { shallow } from "enzyme";

import CoreResources from "./CoreResources";

describe("CoreResources", () => {
  it("renders", () => {
    const wrapper = shallow(<CoreResources allocated={1} free={2} other={3} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("can be made to have a dynamic layout", () => {
    const wrapper = shallow(
      <CoreResources allocated={1} dynamicLayout free={2} />
    );

    expect(
      wrapper
        .find(".core-resources")
        .prop("className")
        ?.includes("core-resources--dynamic-layout")
    ).toBe(true);
  });

  it("renders the pinned core section if cores are provided as arrays", () => {
    const wrapper = shallow(<CoreResources allocated={[1]} free={[2]} />);

    expect(wrapper.find("[data-test='pinned-section']").exists()).toBe(true);
  });

  it("does not render the pinned core section if cores are provided as numbers", () => {
    const wrapper = shallow(<CoreResources allocated={1} free={2} />);

    expect(wrapper.find("[data-test='pinned-section']").exists()).toBe(false);
  });
});
