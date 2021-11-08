import { mount } from "enzyme";

import StorageResources from "./StorageResources";

import { podStoragePoolResource as storagePoolResourceFactory } from "testing/factories";

describe("StorageResources", () => {
  it("displays as a meter if there is only one pool", () => {
    const storagePools = {
      "pool-0": storagePoolResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        path: "/path/0",
        total: 7,
      }),
    };
    const wrapper = mount(
      <StorageResources allocated={3} free={4} pools={storagePools} />
    );
    expect(wrapper.find("StorageMeter").exists()).toBe(true);
    expect(wrapper.find("StorageCards").exists()).toBe(false);
    expect(wrapper.find("[data-test='storage-summary']").exists()).toBe(false);
  });

  it("displays storage summary and pools as cards if there is more than one pool", () => {
    const storagePools = {
      "pool-0": storagePoolResourceFactory({
        allocated_other: 0,
        allocated_tracked: 1,
        path: "/path/0",
        total: 2,
      }),
      "pool-1": storagePoolResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        path: "/path/0",
        total: 4,
      }),
    };
    const wrapper = mount(
      <StorageResources allocated={5} free={6} pools={storagePools} />
    );
    expect(wrapper.find("StorageCards").exists()).toBe(true);
    expect(wrapper.find("[data-test='storage-summary']").exists()).toBe(true);
    expect(wrapper.find("StorageMeter").exists()).toBe(false);
  });
});
