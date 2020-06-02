import { shallow } from "enzyme";
import React from "react";

import Meter from "./Meter";

describe("Meter", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { key: "datum-1", label: "One", value: 1 },
          { key: "datum-2", label: "Two", value: 3 },
        ]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can be made small", () => {
    const wrapper = shallow(<Meter data={[]} small />);
    expect(wrapper.find("div").at(0).props().className).toBe("p-meter--small");
  });

  it("can be given labels", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { key: "datum-1", label: "One", value: 1 },
          { key: "datum-2", label: "Two", value: 3 },
        ]}
      />
    );
    expect(wrapper.find(".p-meter__labels div").at(0).text()).toBe("One");
    expect(wrapper.find(".p-meter__labels div").at(1).text()).toBe("Two");
  });

  it("can be given a custom empty colour", () => {
    const wrapper = shallow(<Meter data={[]} emptyColor="#ABC" />);
    expect(wrapper.find(".p-meter__bar").props().style.backgroundColor).toBe(
      "#ABC"
    );
  });

  it("can be given custom bar colours", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { color: "#AAA", key: "aaa", value: 1 },
          { color: "#BBB", key: "bbb", value: 2 },
          { color: "#CCC", key: "ccc", value: 3 },
        ]}
      />
    );
    expect(
      wrapper.find(".p-meter__filled").at(0).props().style.backgroundColor
    ).toBe("#AAA");
    expect(
      wrapper.find(".p-meter__filled").at(1).props().style.backgroundColor
    ).toBe("#BBB");
    expect(
      wrapper.find(".p-meter__filled").at(2).props().style.backgroundColor
    ).toBe("#CCC");
  });

  it("changes colour if values exceed given maximum value", () => {
    const wrapper = shallow(
      <Meter
        data={[{ color: "#ABC", key: "key", value: 100 }]}
        max={10}
        overColor="#DEF"
      />
    );
    expect(wrapper.find(".p-meter__filled").props().style.backgroundColor).toBe(
      "#DEF"
    );
  });

  it("correctly calculates datum widths", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { key: "ten", value: 10 }, // 10/100 = 10%
          { key: "twenty", value: 20 }, // 20/100 = 20%
          { key: "thirty", value: 30 }, // 30/100 = 30%
          { key: "forty", value: 40 }, // 40/100 = 40%
        ]}
      />
    );
    expect(wrapper.find(".p-meter__filled").at(0).props().style.width).toBe(
      "10%"
    );
    expect(wrapper.find(".p-meter__filled").at(1).props().style.width).toBe(
      "20%"
    );
    expect(wrapper.find(".p-meter__filled").at(2).props().style.width).toBe(
      "30%"
    );
    expect(wrapper.find(".p-meter__filled").at(3).props().style.width).toBe(
      "40%"
    );
  });

  it("correctly calculates datum positions", () => {
    const wrapper = shallow(
      <Meter
        data={[
          { key: "ten", value: 10 }, // 1st = 0%
          { key: "twenty", value: 20 }, // 2nd = 1st width = 10%
          { key: "thirty", value: 30 }, // 3rd = 1st + 2nd width = 30%
          { key: "forty", value: 40 }, // 4th = 1st + 2nd + 3rd width = 60%
        ]}
      />
    );
    expect(wrapper.find(".p-meter__filled").at(0).props().style.left).toBe(
      "0%"
    );
    expect(wrapper.find(".p-meter__filled").at(1).props().style.left).toBe(
      "10%"
    );
    expect(wrapper.find(".p-meter__filled").at(2).props().style.left).toBe(
      "30%"
    );
    expect(wrapper.find(".p-meter__filled").at(3).props().style.left).toBe(
      "60%"
    );
  });
});
