import { shallow } from "enzyme";
import React from "react";

import DoughnutChart from "./DoughnutChart";

describe("DoughnutChart", () => {
  it("renders", () => {
    const wrapper = shallow(
      <DoughnutChart
        label="200GB"
        segmentHoverWidth={20}
        segmentWidth={15}
        segments={[
          {
            color: "#06C",
            tooltip: "Allocated",
            value: 20,
          },
          {
            color: "#cce0f5",
            tooltip: "Free",
            value: 5,
          },
        ]}
        size={96}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can render without tooltips", () => {
    const wrapper = shallow(
      <DoughnutChart
        label="200GB"
        segmentHoverWidth={20}
        segmentWidth={15}
        segments={[
          {
            color: "#06C",
            value: 20,
          },
          {
            color: "#cce0f5",
            value: 5,
          },
        ]}
        size={96}
      />
    );
    const segment = wrapper.find(".doughnut-chart__segment").at(0);
    expect(segment.prop("onMouseOver")).toBe(null);
    expect(segment.prop("onMouseOut")).toBe(null);
  });

  it("can render without a label", () => {
    const wrapper = shallow(
      <DoughnutChart
        segmentHoverWidth={20}
        segmentWidth={15}
        segments={[
          {
            color: "#06C",
            value: 20,
          },
          {
            color: "#cce0f5",
            value: 5,
          },
        ]}
        size={96}
      />
    );
    expect(wrapper.find(".doughnut-chart__label").exists()).toBe(false);
  });
});
