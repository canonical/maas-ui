import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import pod from "./selectors";

describe("pod selectors", () => {
  it("can get all items", () => {
    const items = [podFactory(), podFactory()];
    const state = rootStateFactory({
      pod: podStateFactory({
        items,
      }),
    });
    expect(pod.all(state)).toEqual(items);
  });

  it("can get all KVMs", () => {
    const items = [
      podFactory({ type: "virsh" }),
      podFactory({ type: "lxd" }),
      podFactory({ type: "rsd" }),
      podFactory({ type: "rsd" }),
    ];
    const state = rootStateFactory({
      pod: podStateFactory({
        items,
      }),
    });
    expect(pod.kvms(state)).toStrictEqual([items[0], items[1]]);
  });

  it("can get all RSDs", () => {
    const items = [
      podFactory({ type: "virsh" }),
      podFactory({ type: "lxd" }),
      podFactory({ type: "rsd" }),
      podFactory({ type: "rsd" }),
    ];
    const state = rootStateFactory({
      pod: podStateFactory({
        items,
      }),
    });
    expect(pod.rsds(state)).toStrictEqual([items[2], items[3]]);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loading: true,
      }),
    });
    expect(pod.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
      }),
    });
    expect(pod.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        saving: true,
      }),
    });
    expect(pod.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        saved: true,
      }),
    });
    expect(pod.saved(state)).toEqual(true);
  });

  it("can get the selected pod ids", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        selected: [1, 2, 4],
      }),
    });
    expect(pod.selectedIDs(state)).toEqual([1, 2, 4]);
  });

  it("can get the selected pods", () => {
    const items = [
      podFactory({ id: 1 }),
      podFactory({ id: 2 }),
      podFactory({ id: 3 }),
    ];
    const state = rootStateFactory({
      pod: podStateFactory({
        selected: [1, 2],
        items,
      }),
    });
    expect(pod.selected(state)).toEqual([items[0], items[1]]);
  });

  it("can get the selected KVMs", () => {
    const items = [
      podFactory({ id: 1, type: "virsh" }),
      podFactory({ id: 2, type: "rsd" }),
      podFactory({ id: 3, type: "virsh" }),
    ];
    const state = rootStateFactory({
      pod: podStateFactory({
        selected: [1, 2],
        items,
      }),
    });
    expect(pod.selectedKVMs(state)).toEqual([items[0]]);
  });

  it("can get the selected RSDs", () => {
    const items = [
      podFactory({ id: 1, type: "rsd" }),
      podFactory({ id: 2, type: "virsh" }),
      podFactory({ id: 3, type: "rsd" }),
    ];
    const state = rootStateFactory({
      pod: podStateFactory({
        selected: [1, 2],
        items,
      }),
    });
    expect(pod.selectedRSDs(state)).toEqual([items[0]]);
  });

  it("can get the active pod id", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        active: 1,
      }),
    });
    expect(pod.activeID(state)).toEqual(1);
  });

  it("can get the active pod", () => {
    const activePod = podFactory();
    const state = rootStateFactory({
      pod: podStateFactory({
        active: activePod.id,
        items: [activePod],
      }),
    });
    expect(pod.active(state)).toEqual(activePod);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        errors: "Data is incorrect",
      }),
    });
    expect(pod.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a pod by id", () => {
    const items = [podFactory({ id: 111 }), podFactory({ id: 222 })];
    const state = rootStateFactory({
      pod: podStateFactory({
        items,
      }),
    });
    expect(pod.getById(state, 222)).toStrictEqual(items[1]);
  });

  it("can get a pod's host machine", () => {
    const items = [podFactory({ host: "abc123" })];
    const machineItems = [
      machineFactory({ system_id: "abc123" }),
      machineFactory(),
    ];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items: [controllerFactory()],
      }),
      machine: machineStateFactory({
        items: machineItems,
      }),
      pod: podStateFactory({
        items,
      }),
    });
    expect(pod.getHost(state, items[0])).toStrictEqual(machineItems[0]);
  });

  it("can get a pod's host controller", () => {
    const items = [podFactory({ host: "abc123" })];
    const controllerItems = [
      controllerFactory({ system_id: "abc123" }),
      controllerFactory(),
    ];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items: controllerItems,
      }),
      machine: machineStateFactory({
        items: [machineFactory()],
      }),
      pod: podStateFactory({
        items,
      }),
    });
    expect(pod.getHost(state, items[0])).toStrictEqual(controllerItems[0]);
  });

  it("can get all pod hosts", () => {
    const items = [
      podFactory({ host: "aaaaaa" }),
      podFactory({ host: "bbbbbb" }),
      podFactory({ host: "cccccc" }),
    ];
    const controllerItems = [
      controllerFactory({ system_id: "aaaaaa" }),
      controllerFactory({ system_id: "bbbbbb" }),
    ];
    const machineItems = [
      machineFactory({ system_id: "cccccc" }),
      machineFactory({ system_id: "dddddd" }),
    ];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items: controllerItems,
      }),
      machine: machineStateFactory({
        items: machineItems,
      }),
      pod: podStateFactory({
        items,
      }),
    });
    expect(pod.getAllHosts(state)).toStrictEqual([
      controllerItems[0],
      controllerItems[1],
      machineItems[0],
    ]);
  });

  it("can get a pod's VMs", () => {
    const podWithVMs = podFactory();
    const machinesInPod = [
      machineFactory({ pod: { id: podWithVMs.id, name: podWithVMs.name } }),
      machineFactory({ pod: { id: podWithVMs.id, name: podWithVMs.name } }),
    ];
    const otherMachines = [machineFactory(), machineFactory()];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [...machinesInPod, ...otherMachines],
      }),
      pod: podStateFactory({
        items: [podWithVMs],
      }),
    });
    expect(pod.getVMs(state, podWithVMs)).toStrictEqual(machinesInPod);
  });
});
