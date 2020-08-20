import { shallow } from "enzyme";
import React from "react";

import KVMMeter from "./KVMMeter";

describe("KVMMeter", () => {
  it("renders", () => {
    const wrapper = shallow(
      <KVMMeter allocated={2} free={1} total={3} unit="GB" />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
