import { shallow } from "enzyme";
import React from "react";

import StatusBar from "./StatusBar";

describe("StatusBar", () => {
  it("shows the MAAS major and minor version", () => {
    const wrapper = shallow(<StatusBar version="2.7.5" />);
    expect(wrapper.find("[data-test='status-bar-version']").text()).toBe(
      "MAAS v2.7"
    );
  });
});
