import { shallow } from "enzyme";
import React from "react";

import TableMenu from "./TableMenu";

describe("TableMenu ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <TableMenu links={[{ children: "Item1" }]} title="Actions:" />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
