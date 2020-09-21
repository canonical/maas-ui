import { shallow } from "enzyme";
import React from "react";

import { machine as machineFactory } from "testing/factories";
import KVMResourcesCard from "./KVMResourcesCard";

describe("KVMResourcesCard", () => {
  it("can be given a title", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2 }}
        ram={{ general: { allocated: 2, free: 3 } }}
        vms={[machineFactory({ system_id: "abc123" })]}
        title="Title"
      />
    );

    expect(wrapper.find("[data-test='kvm-resources-card-title']").text()).toBe(
      "Title"
    );
  });

  it("shows hugepage RAM details if provided", () => {
    const withHugepage = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2 }}
        ram={{
          general: { allocated: 2, free: 3 },
          hugepages: [{ allocated: 1, free: 1, pageSize: 1024 }],
        }}
        vms={[machineFactory({ system_id: "abc123" })]}
      />
    );
    const withoutHugepage = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2 }}
        ram={{
          general: { allocated: 2, free: 3 },
          hugepages: [],
        }}
        vms={[machineFactory({ system_id: "abc123" })]}
      />
    );

    expect(withHugepage.find("[data-test='hugepage-ram']").exists()).toBe(true);
    expect(withoutHugepage.find("[data-test='hugepage-ram']").exists()).toBe(
      false
    );
  });

  it("shows virtual function details if any provided interfaces use virtual functions", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2 }}
        interfaces={[
          {
            id: 1,
            name: "eth0",
            virtualFunctions: { allocated: 100, free: 20 },
          },
        ]}
        ram={{
          general: { allocated: 2, free: 3 },
        }}
        vms={[machineFactory({ system_id: "abc123" })]}
      />
    );

    expect(wrapper.find("[data-test='vfs-meter']").exists()).toBe(true);
  });

  it("shows VMs button at bottom of container if no title provided", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2 }}
        ram={{ general: { allocated: 2, free: 3 } }}
        vms={[machineFactory({ system_id: "abc123" })]}
      />
    );

    expect(wrapper.find("[data-test='vms-button-no-title']").exists()).toBe(
      true
    );
  });
});
