import { shallow } from "enzyme";

import RamResources from "./RamResources";

import { COLOURS } from "app/base/constants";

describe("RamResources", () => {
  it("renders", () => {
    const wrapper = shallow(
      <RamResources
        general={{ allocated: 1, free: 2 }}
        hugepages={{ allocated: 3, free: 4, pageSize: 5 }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("can be made to have a dynamic layout", () => {
    const wrapper = shallow(
      <RamResources
        dynamicLayout
        general={{ allocated: 1, free: 2 }}
        hugepages={{ allocated: 3, free: 4 }}
      />
    );

    expect(
      wrapper
        .find(".ram-resources")
        .prop("className")
        ?.includes("ram-resources--dynamic-layout")
    ).toBe(true);
  });

  it("shows hugepages data if provided", () => {
    const wrapper = shallow(
      <RamResources
        general={{ allocated: 1, free: 2 }}
        hugepages={{ allocated: 3, free: 4 }}
      />
    );

    expect(wrapper.find("[data-test='hugepages-data']").exists()).toBe(true);
  });

  it("does not show hugepages data if not provided", () => {
    const wrapper = shallow(
      <RamResources
        general={{ allocated: 1, free: 2 }}
        hugepages={{ allocated: 0, free: 0 }}
      />
    );

    expect(wrapper.find("[data-test='hugepages-data']").exists()).toBe(false);
  });

  it("show hugepages page size if provided", () => {
    const wrapper = shallow(
      <RamResources
        general={{ allocated: 1, free: 2 }}
        hugepages={{ allocated: 3, free: 4, pageSize: 5 }}
      />
    );

    expect(wrapper.find("[data-test='page-size']").exists()).toBe(true);
    expect(wrapper.find("[data-test='page-size']").text()).toBe("(Size: 5B)");
  });

  it("does not show hugepages page size if not provided", () => {
    const wrapper = shallow(
      <RamResources
        general={{ allocated: 1, free: 2 }}
        hugepages={{ allocated: 3, free: 4 }}
      />
    );

    expect(wrapper.find("[data-test='page-size']").exists()).toBe(false);
  });

  it("can show whether RAM has been over-committed", () => {
    const wrapper = shallow(
      <RamResources
        general={{ allocated: 1, free: -1 }}
        hugepages={{ allocated: 3, free: -1 }}
      />
    );

    expect(wrapper.find("DoughnutChart").prop("segments")).toStrictEqual([
      { color: COLOURS.CAUTION, value: 1 },
    ]);
  });
});
