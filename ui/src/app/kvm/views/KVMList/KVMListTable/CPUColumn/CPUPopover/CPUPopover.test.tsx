import { mount } from "enzyme";
import React from "react";

import CPUPopover from "./CPUPopover";

describe("CPUPopover", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  app.setAttribute("id", "app");
  body.appendChild(app);

  // snapshot tests
  it("renders and matches the snapshot", () => {
    const wrapper = mount(
      <CPUPopover assigned={10} physical={6} overcommit={3}>
        Child
      </CPUPopover>
    );
    wrapper.simulate("focus");
    expect(wrapper).toMatchSnapshot();
  });

  it("correctly displays CPU core data", () => {
    const wrapper = mount(
      <CPUPopover assigned={10} physical={6} overcommit={3}>
        Child
      </CPUPopover>
    );
    wrapper.simulate("focus");
    expect(wrapper.find("[data-test='assigned']").text()).toBe("10");
    expect(wrapper.find("[data-test='unassigned']").text()).toBe("8");
    expect(wrapper.find("[data-test='physical']").text()).toBe("6");
    expect(wrapper.find("[data-test='overcommit']").text()).toBe("3");
    expect(wrapper.find("[data-test='total']").text()).toBe("18");
  });
});
