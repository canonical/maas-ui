import subnet from "./selectors";

import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  podDetails as podDetailsFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetEventError as subnetEventErrorFactory,
  subnetState as subnetStateFactory,
  subnetStatus as subnetStatusFactory,
  subnetStatuses as subnetStatusesFactory,
} from "testing/factories";

describe("subnet selectors", () => {
  it("can get all items", () => {
    const items = [subnetFactory(), subnetFactory()];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items,
      }),
    });
    expect(subnet.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        loading: true,
      }),
    });
    expect(subnet.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        loaded: true,
      }),
    });
    expect(subnet.loaded(state)).toEqual(true);
  });

  it("can get a subnet by id", () => {
    const items = [subnetFactory({ id: 808 }), subnetFactory({ id: 909 })];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items,
      }),
    });
    expect(subnet.getById(state, 909)).toStrictEqual(items[1]);
  });

  it("can get multiple subnets by id", () => {
    const items = [
      subnetFactory({ id: 707 }),
      subnetFactory({ id: 808 }),
      subnetFactory({ id: 909 }),
    ];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items,
      }),
    });
    expect(subnet.getByIds(state, [707, 909])).toStrictEqual([
      items[0],
      items[2],
    ]);
  });

  it("can get a subnet by cidr", () => {
    const items = [
      subnetFactory({ cidr: "cidr0" }),
      subnetFactory({ cidr: "cidr1" }),
    ];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items,
      }),
    });
    expect(subnet.getByCIDR(state, "cidr1")).toStrictEqual(items[1]);
  });

  it("can get subnets that are available to a given pod", () => {
    const subnets = [
      subnetFactory({ vlan: 1 }),
      subnetFactory({ vlan: 2 }),
      subnetFactory({ vlan: 3 }),
    ];
    const pod = podDetailsFactory({ attached_vlans: [1, 2] });
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: subnets,
      }),
    });
    expect(subnet.getByPod(state, pod)).toStrictEqual([subnets[0], subnets[1]]);
  });

  it("can get subnets for a VLAN", () => {
    const subnets = [
      subnetFactory({ vlan: 1 }),
      subnetFactory({ vlan: 2 }),
      subnetFactory({ vlan: 1 }),
    ];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: subnets,
      }),
    });
    expect(subnet.getByVLAN(state, 1)).toStrictEqual([subnets[0], subnets[2]]);
  });

  it("can get subnets for a fabric", () => {
    const subnets = [
      subnetFactory({ vlan: 1 }),
      subnetFactory({ vlan: 2 }),
      subnetFactory({ vlan: 3 }),
    ];
    const fabric = fabricFactory({ id: 101, vlan_ids: [1, 3] });
    const state = rootStateFactory({
      fabric: fabricStateFactory({ items: [fabric] }),
      subnet: subnetStateFactory({
        items: subnets,
      }),
    });
    expect(subnet.getByFabric(state, 101)).toStrictEqual([
      subnets[0],
      subnets[2],
    ]);
  });

  it("can get PXE-enabled subnets that are available to a given pod", () => {
    const subnets = [
      subnetFactory({ vlan: 1 }),
      subnetFactory({ vlan: 2 }),
      subnetFactory({ vlan: 3 }),
    ];
    const pod = podDetailsFactory({ boot_vlans: [1, 2] });
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: subnets,
      }),
    });
    expect(subnet.getPxeEnabledByPod(state, pod)).toStrictEqual([
      subnets[0],
      subnets[1],
    ]);
  });

  it("can get the active subnet's id", () => {
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        active: 0,
      }),
    });
    expect(subnet.activeID(state)).toEqual(0);
  });

  it("can get the active subnet", () => {
    const activeFabric = subnetFactory();
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        active: activeFabric.id,
        items: [activeFabric],
      }),
    });
    expect(subnet.active(state)).toEqual(activeFabric);
  });

  it("can get a status for a subnet", () => {
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 0 })],
        statuses: subnetStatusesFactory({
          0: subnetStatusFactory({ scanning: true }),
        }),
      }),
    });
    expect(subnet.getStatusForSubnet(state, 0, "scanning")).toBe(true);
  });

  it("can get event errors for a subnet", () => {
    const subnetEventErrors = [
      subnetEventErrorFactory({ id: 123 }),
      subnetEventErrorFactory(),
    ];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        eventErrors: subnetEventErrors,
      }),
    });
    expect(subnet.eventErrorsForSubnets(state, 123)).toStrictEqual([
      subnetEventErrors[0],
    ]);
  });

  it("can get event errors for a subnet and a provided event", () => {
    const subnetEventErrors = [
      subnetEventErrorFactory({ id: 123, event: "scan" }),
      subnetEventErrorFactory({ id: 123, event: "something-else" }),
    ];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        eventErrors: subnetEventErrors,
      }),
    });
    expect(subnet.eventErrorsForSubnets(state, 123, "scan")).toStrictEqual([
      subnetEventErrors[0],
    ]);
  });
});
