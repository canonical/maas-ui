import { shallow } from "enzyme";

import CoreResources from "./CoreResources";

describe("CoreResources", () => {
  it("renders", () => {
    const wrapper = shallow(
      <CoreResources
        cores={{ allocated: 1, free: 2 }}
        pinned={[1, 2, 3, 4]}
        available={[0, 5, 6, 7]}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("can be made to have a dynamic layout", () => {
    const wrapper = shallow(
      <CoreResources cores={{ allocated: 1, free: 2 }} dynamicLayout />
    );

    expect(
      wrapper
        .find(".core-resources")
        .prop("className")
        ?.includes("core-resources--dynamic-layout")
    ).toBe(true);
  });

  it("renders the pinned core section if data is provided", () => {
    const wrapper = shallow(
      <CoreResources
        cores={{ allocated: 1, free: 2 }}
        pinned={[1]}
        available={[2]}
      />
    );

    expect(wrapper.find("[data-test='pinned-section']").exists()).toBe(true);
  });

  it("does not render the pinned core section if no data is provided", () => {
    const wrapper = shallow(
      <CoreResources cores={{ allocated: 1, free: 2 }} />
    );

    expect(wrapper.find("[data-test='pinned-section']").exists()).toBe(false);
  });
});
