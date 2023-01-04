import vlan from "./selectors";

import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanEventError as vlanEventErrorFactory,
  vlanState as vlanStateFactory,
  vlanStatus as vlanStatusFactory,
  vlanStatuses as vlanStatusesFactory,
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

  it("can get VLANs in a fabric", () => {
    const vlans = [
      vlanFactory({ fabric: 1 }),
      vlanFactory({ fabric: 2 }),
      vlanFactory({ fabric: 1 }),
    ];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items: vlans,
      }),
    });
    expect(vlan.getByFabric(state, 1)).toStrictEqual([vlans[0], vlans[2]]);
  });

  it("can get VLAN with DHCP", () => {
    const vlans = [
      vlanFactory({ dhcp_on: true }),
      vlanFactory({ dhcp_on: false }),
      vlanFactory({ dhcp_on: true }),
    ];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items: vlans,
      }),
    });
    expect(vlan.getWithDHCP(state)).toStrictEqual([vlans[0], vlans[2]]);
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
      const machine = machineDetailsFactory({
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
      const machine = machineDetailsFactory({
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
      const machine = machineDetailsFactory({
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

  it("can get the active vlan's id", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        active: 0,
      }),
    });
    expect(vlan.activeID(state)).toEqual(0);
  });

  it("can get the active vlan", () => {
    const activeFabric = vlanFactory();
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        active: activeFabric.id,
        items: [activeFabric],
      }),
    });
    expect(vlan.active(state)).toEqual(activeFabric);
  });

  it("can get a status for a vlan", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items: [vlanFactory({ id: 0 })],
        statuses: vlanStatusesFactory({
          0: vlanStatusFactory({ configuringDHCP: true }),
        }),
      }),
    });
    expect(vlan.getStatusForVLAN(state, 0, "configuringDHCP")).toBe(true);
  });

  it("can get event errors for a vlan", () => {
    const vlanEventErrors = [
      vlanEventErrorFactory({ id: 123 }),
      vlanEventErrorFactory(),
    ];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        eventErrors: vlanEventErrors,
      }),
    });
    expect(vlan.eventErrorsForVLANs(state, 123)).toStrictEqual([
      vlanEventErrors[0],
    ]);
  });

  it("can get event errors for a vlan and a provided event", () => {
    const vlanEventErrors = [
      vlanEventErrorFactory({ id: 123, event: "configureDHCP" }),
      vlanEventErrorFactory({ id: 123, event: "something-else" }),
    ];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        eventErrors: vlanEventErrors,
      }),
    });
    expect(vlan.eventErrorsForVLANs(state, 123, "configureDHCP")).toStrictEqual(
      [vlanEventErrors[0]]
    );
  });
});
