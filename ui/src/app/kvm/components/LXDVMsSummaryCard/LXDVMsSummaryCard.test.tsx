import { shallow } from "enzyme";

import LXDVMsSummaryCard from "./LXDVMsSummaryCard";

import {
  podNetworkInterface as interfaceFactory,
  podStoragePool as storagePoolFactory,
} from "testing/factories";

describe("LXDVMsSummaryCard", () => {
  it("renders", () => {
    const wrapper = shallow(
      <LXDVMsSummaryCard
        memory={{
          general: { allocated: 1, free: 2 },
          hugepages: { allocated: 3, free: 4 },
        }}
        cores={{ allocated: 5, free: 6 }}
        interfaces={[
          interfaceFactory({
            name: "eth0",
            virtual_functions: {
              allocated_other: 7,
              allocated_tracked: 8,
              free: 9,
            },
          }),
        ]}
        storage={{
          allocated: 10,
          free: 11,
          pools: [
            storagePoolFactory({
              available: 12,
              id: "0",
              name: "pool-1",
              path: "/path/0",
              total: 13,
            }),
          ],
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
