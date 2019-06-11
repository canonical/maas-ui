import React from "react";
import App from "./App";
import { shallow } from "enzyme";

it("works with enzyme", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(".App-link").prop("href")).toBe("https://reactjs.org");
});
