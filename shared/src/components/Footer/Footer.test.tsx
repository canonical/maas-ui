import { shallow } from "enzyme";
import MockDate from "mockdate";
import React from "react";

import { Footer } from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    MockDate.set("2020-01-01");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("renders", () => {
    const wrapper = shallow(<Footer version="2.7.0" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("displays the feedback link when analytics enabled", () => {
    const wrapper = shallow(
      <Footer debug={false} enableAnalytics={true} version="2.7.0" />
    );
    expect(
      wrapper
        .findWhere(
          (node) => node.type() === "a" && node.text() === "Give feedback"
        )
        .exists()
    ).toBe(true);
  });

  it("hides the feedback link when analytics disabled", () => {
    const wrapper = shallow(
      <Footer debug={false} enableAnalytics={false} version="2.7.0" />
    );
    expect(
      wrapper
        .findWhere(
          (node) => node.type() === "a" && node.text() === "Give feedback"
        )
        .exists()
    ).toBe(false);
  });

  it("hides the feedback link in debug mode", () => {
    const wrapper = shallow(
      <Footer debug={true} enableAnalytics={true} version="2.7.0" />
    );
    expect(
      wrapper
        .findWhere(
          (node) => node.type() === "a" && node.text() === "Give feedback"
        )
        .exists()
    ).toBe(false);
  });
});
