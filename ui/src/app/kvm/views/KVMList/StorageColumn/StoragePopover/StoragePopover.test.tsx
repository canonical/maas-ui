import { mount } from "enzyme";

import StoragePopover from "./StoragePopover";

import { podStoragePool as podStoragePoolFactory } from "testing/factories";

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
        total: 15000,
        type: "o-negative",
        used: 5000,
      }),
    ];
    const wrapper = mount(
      <StoragePopover defaultPoolID={pools[0].id} pools={pools}>
        Child
      </StoragePopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='pool-name']").text()).toBe(
      "poolio (default)"
    );
    expect(wrapper.find("[data-test='pool-path']").text()).toBe("/the/way");
    expect(wrapper.find("[data-test='pool-type']").text()).toBe("o-negative");
    expect(wrapper.find("[data-test='pool-allocated']").text()).toBe("5KB");
    expect(wrapper.find("[data-test='pool-free']").text()).toBe("10KB");
  });
});
