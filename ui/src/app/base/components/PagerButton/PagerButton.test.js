import { shallow, mount } from "enzyme";
import React from "react";

import PagerButton from "./PagerButton";

describe("<PagerButton />", () => {
  // snapshot tests
  it("renders and matches the snapshot", () => {
    const component = shallow(
      <PagerButton direction="back" onClick={jest.fn()} />
    );

    expect(component).toMatchSnapshot();
  });

  // unit tests
  it("sets the appropriate classes and text if direction is 'back'", () => {
    const component = shallow(
      <PagerButton direction="back" onClick={jest.fn()} />
    );

    expect(component.find("button").hasClass("p-pagination__link--previous"));
    expect(component.find("i").text()).toEqual("Previous page");
  });

  it("sets the appropriate classes and text if direction is 'forward'", () => {
    const component = shallow(
      <PagerButton direction="forward" onClick={jest.fn()} />
    );

    expect(component.find("button").hasClass("p-pagination__link--next"));
    expect(component.find("i").text()).toEqual("Next page");
  });
});
