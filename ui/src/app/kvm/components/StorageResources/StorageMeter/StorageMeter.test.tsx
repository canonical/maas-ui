import { shallow } from "enzyme";

import StorageMeter from "./StorageMeter";

import { podStoragePool as storagePoolFactory } from "testing/factories";

describe("StorageMeter", () => {
  it("renders", () => {
    const pool = storagePoolFactory({
      id: "a",
      name: "pool-1",
      path: "/path1",
      total: 3,
      used: 1,
    });
    const wrapper = shallow(<StorageMeter pool={pool} />);

    expect(wrapper).toMatchSnapshot();
  });
});
