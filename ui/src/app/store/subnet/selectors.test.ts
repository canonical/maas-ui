import subnet from "./selectors";

import {
  podDetails as podDetailsFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
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
});
