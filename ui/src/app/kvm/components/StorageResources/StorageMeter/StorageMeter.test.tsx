import { mount, shallow } from "enzyme";

import StorageMeter from "./StorageMeter";

import { podStoragePoolResource as storagePoolResourceFactory } from "testing/factories";

describe("StorageMeter", () => {
  it("renders", () => {
    const pools = {
      "pool-1": storagePoolResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        backend: "zfs",
        name: "pool-1",
        path: "/path1",
        total: 3,
      }),
    };
    const wrapper = shallow(<StorageMeter pools={pools} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("does not render if more than one pool present", () => {
    const pools = {
      "pool-1": storagePoolResourceFactory(),
      "pool-2": storagePoolResourceFactory(),
    };
    const wrapper = mount(<StorageMeter pools={pools} />);
    expect(wrapper.find("StorageMeter").prop("children")).toBeFalsy();
  });
});
