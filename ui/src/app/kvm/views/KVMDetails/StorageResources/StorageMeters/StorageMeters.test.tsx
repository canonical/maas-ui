import { mount } from "enzyme";

import StorageMeters from "./StorageMeters";

import { podStoragePool as storagePoolFactory } from "testing/factories";

describe("StorageMeters", () => {
  it("renders", () => {
    const pools = [
      storagePoolFactory({
        id: "a",
        name: "pool-1",
        path: "/path1",
        total: 3,
        used: 1,
      }),
      storagePoolFactory({
        id: "b",
        name: "pool-2",
        path: "/path2",
        total: 5,
        used: 3,
      }),
    ];
    const wrapper = mount(<StorageMeters pools={pools} />);

    expect(wrapper.find("StorageMeters")).toMatchSnapshot();
  });
});
