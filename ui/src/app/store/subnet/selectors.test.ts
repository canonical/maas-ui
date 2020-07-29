import {
  podDetails as podDetailsFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import subnet from "./selectors";

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
});
