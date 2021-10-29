import { mount } from "enzyme";

import StorageResources from "./StorageResources";

import { podStoragePool as storagePoolFactory } from "testing/factories";

describe("StorageResources", () => {
  it("displays as a meter if there is only one pool", () => {
    const storagePools = [
      storagePoolFactory({
        id: "0",
        name: "pool-0",
        path: "/path/0",
        total: 2,
        used: 1,
      }),
    ];
    const wrapper = mount(
      <StorageResources
        storage={{ allocated: 3, free: 4, pools: storagePools }}
      />
    );
    expect(wrapper.find("StorageMeter").exists()).toBe(true);
    expect(wrapper.find("StorageCards").exists()).toBe(false);
  });

  it("displays as cards if there is more than one pool", () => {
    const storagePools = [
      storagePoolFactory({
        id: "0",
        name: "pool-0",
        path: "/path/0",
        total: 2,
        used: 1,
      }),
      storagePoolFactory({
        id: "1",
        name: "pool-1",
        path: "/path/1",
        total: 4,
        used: 3,
      }),
    ];
    const wrapper = mount(
      <StorageResources
        storage={{ allocated: 5, free: 6, pools: storagePools }}
      />
    );
    expect(wrapper.find("StorageCards").exists()).toBe(true);
    expect(wrapper.find("StorageMeter").exists()).toBe(false);
  });
});
