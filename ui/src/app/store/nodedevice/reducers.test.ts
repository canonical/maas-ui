import reducers, { actions } from "./slice";

import {
  nodeDevice as nodeDeviceFactory,
  nodeDeviceState as nodeDeviceStateFactory,
} from "testing/factories";

describe("node device reducer", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces getByMachineIdStart", () => {
    const state = nodeDeviceStateFactory({
      loading: false,
    });

    expect(reducers(state, actions.getByMachineIdStart(null))).toEqual(
      nodeDeviceStateFactory({ loading: true })
    );
  });

  it("reduces getByMachineIdSuccess", () => {
    const existingNodeDevice = nodeDeviceFactory();
    const newNodeDevice = nodeDeviceFactory();
    const newNodeDevice2 = nodeDeviceFactory();

    const nodeDeviceState = nodeDeviceStateFactory({
      items: [existingNodeDevice],
      loading: true,
    });

    expect(
      reducers(
        nodeDeviceState,
        actions.getByMachineIdSuccess([newNodeDevice, newNodeDevice2])
      )
    ).toEqual(
      nodeDeviceStateFactory({
        items: [existingNodeDevice, newNodeDevice, newNodeDevice2],
        loading: false,
        loaded: true,
      })
    );
  });

  it("reduces getByMachineIdError", () => {
    const nodeDeviceState = nodeDeviceStateFactory({ loading: true });

    expect(
      reducers(
        nodeDeviceState,
        actions.getByMachineIdError("Could not get node device")
      )
    ).toEqual(
      nodeDeviceStateFactory({
        errors: "Could not get node device",
        loading: false,
      })
    );
  });
});
