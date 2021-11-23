import reducers, { actions } from "./slice";
import { DeviceMeta } from "./types";

import {
  device as deviceFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceStatus as deviceStatusFactory,
  deviceState as deviceStateFactory,
} from "testing/factories";

describe("device reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      active: null,
      errors: null,
      eventErrors: [],
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("reduces fetchStart", () => {
    expect(reducers(undefined, actions.fetchStart())).toEqual(
      deviceStateFactory({
        loaded: false,
        loading: true,
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const devices = [deviceFactory(), deviceFactory()];
    expect(
      reducers(
        deviceStateFactory({
          items: [],
          loaded: false,
          loading: true,
        }),
        actions.fetchSuccess(devices)
      )
    ).toEqual(
      deviceStateFactory({
        loading: false,
        loaded: true,
        items: devices,
        statuses: {
          [devices[0][DeviceMeta.PK]]: deviceStatusFactory(),
          [devices[1][DeviceMeta.PK]]: deviceStatusFactory(),
        },
      })
    );
  });

  it("reduces createInterfaceStart", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ creatingInterface: false }),
          },
        }),
        actions.createInterfaceStart({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ creatingInterface: true }),
        },
      })
    );
  });

  it("reduces createInterfaceError", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: deviceStatusFactory({ creatingInterface: true }),
          },
        }),
        actions.createInterfaceError({
          error: true,
          item: {
            [DeviceMeta.PK]: "abc123",
          },
          payload: "It's realllll bad",
        })
      )
    ).toEqual(
      deviceStateFactory({
        errors: "It's realllll bad",
        eventErrors: [
          deviceEventErrorFactory({
            error: "It's realllll bad",
            event: "createInterface",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: deviceStatusFactory({ creatingInterface: false }),
        },
      })
    );
  });

  it("reduces createInterfaceSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ creatingInterface: true }),
          },
        }),
        actions.createInterfaceSuccess({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ creatingInterface: false }),
        },
      })
    );
  });
});
