import selectors from "./selectors";

import {
  machine as machineFactory,
  nodeDevice as nodeDeviceFactory,
  nodeDeviceState as nodeDeviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("nodeDevice selectors", () => {
  it("can get all items", () => {
    const items = [nodeDeviceFactory(), nodeDeviceFactory()];
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items,
      }),
    });
    expect(selectors.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        loading: true,
      }),
    });
    expect(selectors.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        loaded: true,
      }),
    });
    expect(selectors.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        saving: true,
      }),
    });
    expect(selectors.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        saved: true,
      }),
    });
    expect(selectors.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        errors: "it's all ruined",
      }),
    });
    expect(selectors.errors(state)).toEqual("it's all ruined");
  });

  it("can get a node device by its id", () => {
    const [thisNodeDevice, otherNodeDevice] = [
      nodeDeviceFactory(),
      nodeDeviceFactory(),
    ];
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [thisNodeDevice, otherNodeDevice],
      }),
    });
    expect(selectors.getById(state, thisNodeDevice.id)).toStrictEqual(
      thisNodeDevice
    );
  });

  it("can get node devices for a machine", () => {
    const machine = machineFactory();
    const machineNodeDevices = [
      nodeDeviceFactory({ node_id: machine.id }),
      nodeDeviceFactory({ node_id: machine.id }),
    ];
    const items = [...machineNodeDevices, nodeDeviceFactory()];
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items,
      }),
    });
    expect(selectors.getByMachineId(state, machine.id)).toStrictEqual(
      machineNodeDevices
    );
  });
});
