import { shallow } from "enzyme";
import React from "react";

import Tabs from "./Tabs";

describe("Tabs", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Tabs
        links={[
          {
            active: true,
            label: "label1",
            path: "path1",
          },
          {
            active: false,
            label: "label2",
            path: "path2",
          },
        ]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("sets an active item correctly", () => {
    const wrapper = shallow(
      <Tabs
        links={[
          {
            active: true,
            label: "label1",
            path: "path1",
          },
          {
            active: false,
            label: "label2",
            path: "path2",
          },
        ]}
      />
    );
    expect(wrapper.find("Link[aria-selected=true]").length).toBe(1);
  });
});
