import React from "react";

import { shallow } from "enzyme";

import LegacyLink from "./LegacyLink";

describe("LegacyLink", () => {
  it("renders", () => {
    const wrapper = shallow(
      <LegacyLink route="/machines">Machines</LegacyLink>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
