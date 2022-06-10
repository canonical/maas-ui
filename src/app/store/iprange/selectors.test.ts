import ipRange from "./selectors";

import {
  rootState as rootStateFactory,
  ipRange as ipRangeFactory,
  ipRangeState as ipRangeStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

describe("all", () => {
  it("returns list of all IP ranges", () => {
    const items = [ipRangeFactory(), ipRangeFactory()];
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        items,
      }),
    });
    expect(ipRange.all(state)).toStrictEqual(items);
  });
});

describe("loading", () => {
  it("returns iprange loading state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        loading: false,
      }),
    });
    expect(ipRange.loading(state)).toStrictEqual(false);
  });
});

describe("loaded", () => {
  it("returns iprange loaded state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        loaded: true,
      }),
    });
    expect(ipRange.loaded(state)).toStrictEqual(true);
  });
});

describe("errors", () => {
  it("returns iprange error state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        errors: "Unable to list IP ranges.",
      }),
    });
    expect(ipRange.errors(state)).toEqual("Unable to list IP ranges.");
  });
});

describe("saving", () => {
  it("returns iprange saving state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        saving: true,
      }),
    });
    expect(ipRange.saving(state)).toStrictEqual(true);
  });
});

describe("saved", () => {
  it("returns iprange saved state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        saved: true,
      }),
    });
    expect(ipRange.saved(state)).toStrictEqual(true);
  });
});

describe("getBySubnet", () => {
  it("returns IP ranges that are in a subnet", () => {
    const subnet = subnetFactory();
    const subnet2 = subnetFactory();
    const items = [
      ipRangeFactory({ subnet: subnet.id }),
      ipRangeFactory({ subnet: subnet.id }),
      ipRangeFactory({ subnet: subnet2.id }),
    ];
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        items,
      }),
      subnet: subnetStateFactory({
        items: [subnet, subnet2],
      }),
    });
    expect(ipRange.getBySubnet(state, subnet.id)).toStrictEqual([
      items[0],
      items[1],
    ]);
  });

  it("handles a null subnet", () => {
    const state = rootStateFactory();
    expect(ipRange.getBySubnet(state, null)).toStrictEqual([]);
  });
});

describe("getByVLAN", () => {
  it("returns IP ranges that are in a VLAN", () => {
    const vlan = vlanFactory();
    const vlan2 = vlanFactory();
    const items = [
      ipRangeFactory({ vlan: vlan.id }),
      ipRangeFactory({ vlan: vlan.id }),
      ipRangeFactory({ vlan: vlan2.id }),
    ];
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        items,
      }),
      vlan: vlanStateFactory({
        items: [vlan, vlan2],
      }),
    });
    expect(ipRange.getByVLAN(state, vlan.id)).toStrictEqual([
      items[0],
      items[1],
    ]);
  });

  it("handles a null VLAN", () => {
    const state = rootStateFactory();
    expect(ipRange.getByVLAN(state, null)).toStrictEqual([]);
  });
});
