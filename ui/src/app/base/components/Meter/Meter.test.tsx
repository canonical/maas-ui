import { mount, shallow } from "enzyme";

import Meter, { DEFAULT_SEPARATOR_COLOR } from "./Meter";

const mockClientRect = ({
  bottom = 0,
  height = 0,
  left = 0,
  right = 0,
  toJSON = () => undefined,
  top = 0,
  width = 0,
  x = 0,
  y = 0,
}) =>
  jest.fn(() => {
    return {
      bottom,
      height,
      left,
      right,
      toJSON,
      top,
      width,
      x,
      y,
    };
  });

describe("Meter", () => {
  it("renders", () => {
    const wrapper = shallow(<Meter data={[{ value: 1 }, { value: 3 }]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("can be made small", () => {
    const wrapper = shallow(<Meter data={[]} small />);
    expect(wrapper.find("div").at(0).props().className).toBe("p-meter--small");
  });

  it("can be given a label", () => {
    const wrapper = shallow(
      <Meter data={[{ value: 1 }, { value: 3 }]} label="Meter label" />
    );
    expect(wrapper.find(".p-meter__label").at(0).text()).toBe("Meter label");
  });

  it("can be given a custom empty colour", () => {
    const wrapper = shallow(<Meter data={[]} emptyColor="#ABC" />);
    expect(wrapper.find(".p-meter__bar").props().style?.backgroundColor).toBe(
      "#ABC"
    );
  });

  it("can be given custom bar colours", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { color: "#AAA", value: 1 },
          { color: "#BBB", value: 2 },
          { color: "#CCC", value: 3 },
        ]}
      />
    );
    expect(
      wrapper.find(".p-meter__filled").at(0).props().style?.backgroundColor
    ).toBe("#AAA");
    expect(
      wrapper.find(".p-meter__filled").at(1).props().style?.backgroundColor
    ).toBe("#BBB");
    expect(
      wrapper.find(".p-meter__filled").at(2).props().style?.backgroundColor
    ).toBe("#CCC");
  });

  it("changes colour if values exceed given maximum value", () => {
    const wrapper = shallow(
      <Meter data={[{ color: "#ABC", value: 100 }]} max={10} overColor="#DEF" />
    );
    expect(
      wrapper.find(".p-meter__filled").props().style?.backgroundColor
    ).toBe("#DEF");
  });

  it("correctly calculates datum widths", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { value: 10 }, // 10/100 = 10%
          { value: 20 }, // 20/100 = 20%
          { value: 30 }, // 30/100 = 30%
          { value: 40 }, // 40/100 = 40%
        ]}
      />
    );
    expect(wrapper.find(".p-meter__filled").at(0).props().style?.width).toBe(
      "10%"
    );
    expect(wrapper.find(".p-meter__filled").at(1).props().style?.width).toBe(
      "20%"
    );
    expect(wrapper.find(".p-meter__filled").at(2).props().style?.width).toBe(
      "30%"
    );
    expect(wrapper.find(".p-meter__filled").at(3).props().style?.width).toBe(
      "40%"
    );
  });

  it("correctly calculates datum positions", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { value: 10 }, // 1st = 0%
          { value: 20 }, // 2nd = 1st width = 10%
          { value: 30 }, // 3rd = 1st + 2nd width = 30%
          { value: 40 }, // 4th = 1st + 2nd + 3rd width = 60%
        ]}
      />
    );
    expect(wrapper.find(".p-meter__filled").at(0).props().style?.left).toBe(
      "0%"
    );
    expect(wrapper.find(".p-meter__filled").at(1).props().style?.left).toBe(
      "10%"
    );
    expect(wrapper.find(".p-meter__filled").at(2).props().style?.left).toBe(
      "30%"
    );
    expect(wrapper.find(".p-meter__filled").at(3).props().style?.left).toBe(
      "60%"
    );
  });

  it("can be made segmented", () => {
    const wrapper = mount(<Meter data={[{ value: 2 }]} max={10} segmented />);
    expect(wrapper.find(".p-meter__separators").exists()).toBe(true);
  });

  it("can set the segment separator color", () => {
    const wrapper = mount(
      <Meter
        data={[{ value: 2 }]}
        max={10}
        segmented
        separatorColor="#abc123"
      />
    );

    const backgroundStyle = wrapper.find(".p-meter__separators").props().style
      ?.background as string;
    expect(backgroundStyle.includes("#abc123")).toBe(true);
  });

  it("sets segment width to 1px if not enough space to show all segments", () => {
    // Make width 128px so max number of segments is 64 (1px segment, 1px separator)
    Element.prototype.getBoundingClientRect = mockClientRect({
      width: 128,
    });
    const wrapper = mount(<Meter data={[{ value: 10 }]} segmented max={100} />);

    const backgroundStyle = wrapper.find(".p-meter__separators").props().style
      ?.background as string;
    const trimmed = backgroundStyle.replace(/\s\s+/g, " ");
    expect(trimmed).toBe(
      `repeating-linear-gradient( to right, transparent 0, transparent 1px, ${DEFAULT_SEPARATOR_COLOR} 1px, ${DEFAULT_SEPARATOR_COLOR} 2px )`
    );
  });
});
