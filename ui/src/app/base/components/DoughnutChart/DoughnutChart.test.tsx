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

  it("can show a tooltip when hovering a segment", () => {
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
    expect(wrapper.find(".doughnut-chart__tooltip").exists()).toBe(false);
    const segment = wrapper.find(".doughnut-chart__segment").at(0);
    segment.simulate("mouseover", {
      currentTarget: {
        addEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({
          x: 0,
          y: 0,
        })),
      },
    });
    expect(wrapper.find(".doughnut-chart__tooltip").exists()).toBe(true);
  });

  it("hide a tooltip when unhovering a segment", () => {
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
    const segment = wrapper.find(".doughnut-chart__segment").at(0);
    segment.simulate("mouseover", {
      currentTarget: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({
          x: 0,
          y: 0,
        })),
      },
    });
    expect(wrapper.find(".doughnut-chart__tooltip").exists()).toBe(true);
    segment.simulate("mouseout");
    expect(wrapper.find(".doughnut-chart__tooltip").exists()).toBe(false);
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
