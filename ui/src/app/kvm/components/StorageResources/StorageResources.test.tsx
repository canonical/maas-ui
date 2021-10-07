import { shallow } from "enzyme";

import StorageResources from "./StorageResources";

import { podStoragePool as storagePoolFactory } from "testing/factories";

describe("StorageResources", () => {
  it("renders", () => {
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
    const wrapper = shallow(
      <StorageResources
        storage={{ allocated: 5, free: 6, pools: storagePools }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
