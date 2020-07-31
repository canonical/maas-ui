import { mount } from "enzyme";
import React from "react";

import RAMPopover from "./RAMPopover";

describe("RAMPopover", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  if (body && app) {
    app.setAttribute("id", "app");
    body.appendChild(app);
  }

  it("correctly displays RAM data", () => {
    const wrapper = mount(
      <RAMPopover assigned={4096} physical={8192} overcommit={2}>
        Child
      </RAMPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='assigned']").text()).toBe("4 GiB");
    expect(wrapper.find("[data-test='unassigned']").text()).toBe("12 GiB");
    expect(wrapper.find("[data-test='physical']").text()).toBe("8 GiB");
    expect(wrapper.find("[data-test='overcommit']").text()).toBe("2");
    expect(wrapper.find("[data-test='total']").text()).toBe("16 GiB");
  });
});
