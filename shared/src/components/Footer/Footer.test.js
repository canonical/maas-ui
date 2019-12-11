import { shallow } from "enzyme";
import React from "react";

import { Footer } from "./Footer";

describe("Footer", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    const wrapper = shallow(
      <Footer maasName="koala-maas" version="2.7.0" />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
