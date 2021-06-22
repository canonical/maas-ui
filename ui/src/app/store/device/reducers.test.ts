import reducers, { actions } from "./";

import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
} from "testing/factories";

describe("device reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces fetchStart", () => {
    expect(reducers(undefined, actions.fetchStart())).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
    });
  });

  it("reduces fetchSuccess", () => {
    const devices = [deviceFactory(), deviceFactory()];
    expect(
      reducers(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        actions.fetchSuccess(devices)
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      items: devices,
      saved: false,
      saving: false,
    });
  });

  it("reduces createInterfaceStart", () => {
    expect(
      reducers(
        deviceStateFactory({ saving: false, saved: true }),
        actions.createInterfaceStart()
      )
    ).toEqual(deviceStateFactory({ saving: true, saved: false }));
  });

  it("reduces createInterfaceError", () => {
    expect(
      reducers(
        deviceStateFactory({ saving: true, errors: "It's realllll bad" }),
        actions.createInterfaceError("It's realllll bad")
      )
    ).toEqual(
      deviceStateFactory({ saving: false, errors: "It's realllll bad" })
    );
  });

  it("reduces createInterfaceSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          saving: true,
          saved: false,
        }),
        actions.createInterfaceSuccess()
      )
    ).toEqual(deviceStateFactory({ errors: null, saving: false, saved: true }));
  });
});
