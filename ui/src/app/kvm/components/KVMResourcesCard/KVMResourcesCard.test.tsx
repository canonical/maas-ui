import { shallow } from "enzyme";
import React from "react";

import KVMResourcesCard from "./KVMResourcesCard";

describe("KVMResourcesCard", () => {
  it("renders", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2, total: 3 }}
        nics={[]}
        ram={{ general: { allocated: 2, free: 3, total: 5 } }}
        vms={["abc123"]}
        title="Title"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("can be given a title", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2, total: 3 }}
        nics={[]}
        ram={{ general: { allocated: 2, free: 3, total: 5 } }}
        vms={["abc123"]}
        title="Title"
      />
    );

    expect(wrapper.find("[data-test='kvm-resources-card-title']").text()).toBe(
      "Title"
    );
  });

  it("shows hugepage RAM details if provided", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2, total: 3 }}
        nics={[]}
        ram={{
          general: { allocated: 2, free: 3, total: 5 },
          hugepage: { allocated: 1, free: 1, total: 2, pagesize: 1024 },
        }}
        vfs={{ allocated: 100, free: 156, total: 256 }}
        vms={["abc123"]}
      />
    );

    expect(wrapper.find("[data-test='hugepage-ram']").exists()).toBe(true);
  });

  it("shows virtual function details if provided", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2, total: 3 }}
        nics={[]}
        ram={{
          general: { allocated: 2, free: 3, total: 5 },
        }}
        vfs={{ allocated: 100, free: 156, total: 256 }}
        vms={["abc123"]}
      />
    );

    expect(wrapper.find("[data-test='vfs-meter']").exists()).toBe(true);
  });

  it("shows VMs button at bottom of container if no title provided", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2, total: 3 }}
        nics={[]}
        ram={{ general: { allocated: 2, free: 3, total: 5 } }}
        vms={["abc123"]}
      />
    );

    expect(wrapper.find("[data-test='vms-button-no-title']").exists()).toBe(
      true
    );
  });
});
