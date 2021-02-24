import vlan from "./selectors";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machine as machineFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

describe("vlan selectors", () => {
  it("can get all items", () => {
    const items = [vlanFactory()];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items,
      }),
    });
    expect(vlan.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        loading: true,
      }),
    });
    expect(vlan.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        loaded: true,
      }),
    });
    expect(vlan.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        saving: true,
      }),
    });
    expect(vlan.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        saved: true,
      }),
    });
    expect(vlan.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        errors: "errors!",
      }),
    });
    expect(vlan.errors(state)).toEqual("errors!");
  });

  it("can get a vlan by id", () => {
    const items = [vlanFactory({ id: 10 }), vlanFactory({ id: 42 })];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items,
      }),
    });
    expect(vlan.getById(state, 42)).toStrictEqual(items[1]);
  });

  it("can filter vlans by name", () => {
    const items = [vlanFactory({ name: "abc" }), vlanFactory({ name: "def" })];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items,
      }),
    });
    expect(vlan.search(state, "d")).toStrictEqual([items[1]]);
  });

  describe("getUnusedForInterface", () => {
    it("does not include the default vlan", () => {
      const fabric = fabricFactory();
      const items = [
        vlanFactory({ fabric: fabric.id, vid: 0 }),
        vlanFactory({ fabric: fabric.id }),
      ];
      const nic = machineInterfaceFactory({
        vlan_id: items[0].id,
      });
      const machine = machineFactory({
        interfaces: [nic],
      });
      const state = rootStateFactory({
        fabric: fabricStateFactory({
          items: [fabric],
        }),
        machine: machineStateFactory({
          items: [machine],
        }),
        vlan: vlanStateFactory({
          items,
        }),
      });
      expect(vlan.getUnusedForInterface(state, machine, nic)).toStrictEqual([
        items[1],
      ]);
    });

    it("does not include vlans used by a child", () => {
      const fabric = fabricFactory();
      const items = [
        vlanFactory({ fabric: fabric.id, vid: 0 }),
        vlanFactory({ fabric: fabric.id }),
        vlanFactory({ fabric: fabric.id }),
      ];
      const nic = machineInterfaceFactory({
        vlan_id: items[0].id,
      });
      const machine = machineFactory({
        interfaces: [
          nic,
          machineInterfaceFactory({
            type: NetworkInterfaceTypes.VLAN,
            parents: [nic.id],
            vlan_id: items[2].id,
          }),
        ],
      });
      const state = rootStateFactory({
        fabric: fabricStateFactory({
          items: [fabric],
        }),
        machine: machineStateFactory({
          items: [machine],
        }),
        vlan: vlanStateFactory({
          items,
        }),
      });
      expect(vlan.getUnusedForInterface(state, machine, nic)).toStrictEqual([
        items[1],
      ]);
    });

    it("does not include vlans on another fabric", () => {
      const fabric = fabricFactory({ id: 1 });
      const items = [
        vlanFactory({ fabric: fabric.id, vid: 0 }),
        vlanFactory({ fabric: 2 }),
      ];
      const nic = machineInterfaceFactory({
        vlan_id: items[0].id,
      });
      const machine = machineFactory({
        interfaces: [nic],
      });
      const state = rootStateFactory({
        fabric: fabricStateFactory({
          items: [fabric],
        }),
        machine: machineStateFactory({
          items: [machine],
        }),
        vlan: vlanStateFactory({
          items,
        }),
      });
      expect(vlan.getUnusedForInterface(state, machine, nic)).toStrictEqual([]);
    });
  });
});
