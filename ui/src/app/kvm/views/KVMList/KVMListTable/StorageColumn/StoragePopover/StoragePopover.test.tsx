import { mount } from "enzyme";
import React from "react";

import { podStoragePool as podStoragePoolFactory } from "testing/factories";
import StoragePopover from "./StoragePopover";

describe("StoragePopover", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  if (body && app) {
    app.setAttribute("id", "app");
    body.appendChild(app);
  }

  it("correctly displays storage data", () => {
    const pools = [
      podStoragePoolFactory({
        name: "poolio",
        path: "/the/way",
        total: 1000,
        type: "o-negative",
        used: 500,
      }),
    ];
    const wrapper = mount(<StoragePopover pools={pools}>Child</StoragePopover>);
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='pool-name']").text()).toBe("poolio");
    expect(wrapper.find("[data-test='pool-path']").text()).toBe("/the/way");
    expect(wrapper.find("[data-test='pool-type']").text()).toBe("o-negative");
    expect(wrapper.find("[data-test='pool-space']").text()).toBe(
      "0.5 of 1 KB assigned"
    );
  });

  it("adds horizontal rules between pools", () => {
    const pools = [
      podStoragePoolFactory(),
      podStoragePoolFactory(),
      podStoragePoolFactory(),
    ];
    const wrapper = mount(<StoragePopover pools={pools}>Child</StoragePopover>);
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("hr").length).toBe(pools.length - 1);
  });
});
