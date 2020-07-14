import { shallow } from "enzyme";
import React from "react";

import Slider from "./Slider";

describe("Slider", () => {
  it("renders correctly", () => {
    const wrapper = shallow(
      <Slider max={10} min={0} onChange={jest.fn()} showInput value={5} />
    );
    // Snapshot should not include extra number input beside the slider.
    expect(wrapper).toMatchSnapshot();
  });

  it("can render without an additional number input", () => {
    const wrapper = shallow(
      <Slider
        max={10}
        min={0}
        onChange={jest.fn()}
        showInput={false}
        value={5}
      />
    );
    // Snapshot should include extra number input beside the slider.
    expect(wrapper.find("input[type='number']").exists()).toBe(false);
  });

  it("correctly displays filled portion", () => {
    const wrapper = shallow(
      <Slider max={10} min={2} onChange={jest.fn()} showInput value={4} />
    );
    const backgroundStyle = wrapper.find(".p-slider").props().style
      ?.background as string;
    const trimmed = backgroundStyle?.replace(/\s\s+/g, " ");
    const expectedPercentage = "25%"; // ((4 - 2) / (10 - 2)) * 100 = (2 / 8) * 100 = 25
    expect(trimmed.includes(expectedPercentage)).toBe(true);
  });

  it("can be given a custom filled color", () => {
    const wrapper = shallow(
      <Slider
        filledColor="#abc123"
        max={8}
        min={2}
        onChange={jest.fn()}
        showInput
        value={4}
      />
    );
    const backgroundStyle = wrapper.find(".p-slider").props().style
      ?.background as string;
    const trimmed = backgroundStyle.replace(/\s\s+/g, " ");
    expect(trimmed.includes("#abc123")).toBe(true);
  });
});
