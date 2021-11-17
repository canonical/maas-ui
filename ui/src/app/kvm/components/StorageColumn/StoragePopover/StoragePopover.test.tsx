import { mount } from "enzyme";

import StoragePopover from "./StoragePopover";

import { podStoragePoolResource as podStoragePoolResourceFactory } from "testing/factories";

describe("StoragePopover", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  if (body && app) {
    app.setAttribute("id", "app");
    body.appendChild(app);
  }

  it("correctly displays storage data", () => {
    const pools = {
      poolio: podStoragePoolResourceFactory({
        allocated_other: 2000,
        allocated_tracked: 5000,
        backend: "zfs",
        path: "/path",
        total: 15000,
      }),
    };
    const wrapper = mount(<StoragePopover pools={pools}>Child</StoragePopover>);
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-testid='pool-name']").text()).toBe("poolio");
    expect(wrapper.find("[data-testid='pool-path']").text()).toBe("/path");
    expect(wrapper.find("[data-testid='pool-backend']").text()).toBe("zfs");
    expect(wrapper.find("[data-testid='pool-allocated']").text()).toBe("5KB");
    expect(wrapper.find("[data-testid='pool-free']").text()).toBe("8KB");
    expect(wrapper.find("[data-testid='pool-others']").text()).toBe("2KB");
  });

  it("does not display others data if none present", () => {
    const pools = {
      poolio: podStoragePoolResourceFactory({
        allocated_other: 0,
        allocated_tracked: 5000,
        backend: "zfs",
        path: "/path",
        total: 15000,
      }),
    };
    const wrapper = mount(<StoragePopover pools={pools}>Child</StoragePopover>);
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-testid='others-col']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='pool-others']").exists()).toBe(false);
  });

  it("shows whether a pool is the default pool", () => {
    const pools = {
      poolio: podStoragePoolResourceFactory({ id: "abc123" }),
    };
    const wrapper = mount(
      <StoragePopover defaultPoolId="abc123" pools={pools}>
        Child
      </StoragePopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-testid='pool-name']").text()).toBe(
      "poolio (default)"
    );
  });
});
