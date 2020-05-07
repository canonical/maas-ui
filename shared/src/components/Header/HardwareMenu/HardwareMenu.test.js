import { shallow } from "enzyme";
import React from "react";

import { HardwareMenu } from "./HardwareMenu";

describe("HardwareMenu", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    const wrapper = shallow(
      <HardwareMenu
        generateLink={jest.fn()}
        links={[
          {
            inHardwareMenu: true,
            isLegacy: false,
            label: "Machines",
            url: "/machines",
          },
        ]}
        toggleHardwareMenu={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
