import { shallow } from "enzyme";
import React from "react";

import ColumnToggle from "./ColumnToggle";

describe("ColumnToggle ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <ColumnToggle
        isExpanded={false}
        label="maas.local"
        onClose={jest.fn()}
        onOpen={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("calls the close function when expanded", () => {
    const onClose = jest.fn();
    const wrapper = shallow(
      <ColumnToggle
        isExpanded={true}
        label="maas.local"
        onClose={onClose}
        onOpen={jest.fn()}
      />
    );
    wrapper.simulate("click");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls the open function when not expanded", () => {
    const onOpen = jest.fn();
    const wrapper = shallow(
      <ColumnToggle
        isExpanded={false}
        label="maas.local"
        onClose={jest.fn()}
        onOpen={onOpen}
      />
    );
    wrapper.simulate("click");
    expect(onOpen).toHaveBeenCalled();
  });
});
