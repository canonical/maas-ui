import { shallow } from "enzyme";
import React from "react";

import { Footer } from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    const mockDate = new Date(2020, 1, 1, 0, 0, 0);
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    const wrapper = shallow(<Footer maasName="koala-maas" version="2.7.0" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("displays the feedback link when analytics enabled", () => {
    const wrapper = shallow(
      <Footer
        maasName="koala-maas"
        version="2.7.0"
        debug={false}
        enableAnalytics={true}
      />
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
      <Footer
        maasName="koala-maas"
        version="2.7.0"
        debug={false}
        enableAnalytics={false}
      />
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
      <Footer
        maasName="koala-maas"
        version="2.7.0"
        debug={true}
        enableAnalytics={true}
      />
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
