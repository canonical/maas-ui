import { shallow } from "enzyme";

import RamResources from "./RamResources";

import { COLOURS } from "app/base/constants";

describe("RamResources", () => {
  it("renders", () => {
    const wrapper = shallow(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        generalOther={3}
        hugepagesAllocated={4}
        hugepagesFree={5}
        hugepagesOther={6}
        pageSize={7}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("can be made to have a dynamic layout", () => {
    const wrapper = shallow(
      <RamResources dynamicLayout generalAllocated={1} generalFree={2} />
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
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
      />
    );

    expect(wrapper.find("[data-test='hugepages-data']").exists()).toBe(true);
  });

  it("does not show hugepages data if not provided", () => {
    const wrapper = shallow(
      <RamResources generalAllocated={1} generalFree={2} />
    );

    expect(wrapper.find("[data-test='hugepages-data']").exists()).toBe(false);
  });

  it("show hugepages page size if provided", () => {
    const wrapper = shallow(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
        pageSize={5}
      />
    );

    expect(wrapper.find("[data-test='page-size']").exists()).toBe(true);
    expect(wrapper.find("[data-test='page-size']").text()).toBe("(Size: 5B)");
  });

  it("does not show hugepages page size if not provided", () => {
    const wrapper = shallow(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
      />
    );

    expect(wrapper.find("[data-test='page-size']").exists()).toBe(false);
  });

  it("can show whether RAM has been over-committed", () => {
    const wrapper = shallow(
      <RamResources
        generalAllocated={1}
        generalFree={-1}
        hugepagesAllocated={3}
        hugepagesFree={-1}
      />
    );

    expect(wrapper.find("DoughnutChart").prop("segments")).toStrictEqual([
      { color: COLOURS.CAUTION, value: 1 },
    ]);
  });

  it("shows RAM used by other projects if data provided", () => {
    const wrapper = shallow(
      <RamResources generalAllocated={1} generalFree={2} generalOther={3} />
    );

    expect(wrapper.find("[data-test='others-col']").exists()).toBe(true);
  });
});
