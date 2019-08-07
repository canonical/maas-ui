import { shallow } from "enzyme";
import React from "react";
import GeneralForm from "./GeneralForm";

describe("GeneralForm", () => {
  it("can render", () => {
    const wrapper = shallow(<GeneralForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
