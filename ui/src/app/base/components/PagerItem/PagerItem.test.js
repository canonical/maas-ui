import { shallow } from "enzyme";
import React from "react";

import PagerItem from "./PagerItem";

describe("<PagerItem />", () => {
  // snapshot tests
  it("renders and matches the snapshot", () => {
    const component = shallow(<PagerItem number={1} onClick={jest.fn()} />);

    expect(component).toMatchSnapshot();
  });

  // unit tests
  it("displays the page number", () => {
    const component = shallow(<PagerItem number={1} onClick={jest.fn()} />);

    expect(component.find("button").text()).toEqual("1");
  });

  it("sets isActive", () => {
    const component = shallow(
      <PagerItem number={1} onClick={jest.fn()} isActive />
    );

    expect(component.find("button").hasClass("is-active"));
  });
});
