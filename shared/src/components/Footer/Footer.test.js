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
});
