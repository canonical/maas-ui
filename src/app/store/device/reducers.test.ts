import reducers, { actions } from "./slice";
import { DeviceMeta } from "./types";

import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceStatus as deviceStatusFactory,
  deviceState as deviceStateFactory,
} from "testing/factories";

describe("device reducers", () => {
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

  it("reduces createNotify", () => {
    const initialState = deviceStateFactory({
      items: [deviceFactory({ system_id: "abc123" })],
      statuses: { abc123: deviceStatusFactory() },
    });
    const newDevice = deviceFactory({ system_id: "def456" });

    expect(reducers(initialState, actions.createNotify(newDevice))).toEqual(
      deviceStateFactory({
        items: [...initialState.items, newDevice],
        statuses: {
          abc123: deviceStatusFactory(),
          def456: deviceStatusFactory(),
        },
      })
    );
  });

  it("should update if device exists on createNotify", () => {
    const initialState = deviceStateFactory({
      items: [deviceFactory({ hostname: "device1", system_id: "abc123" })],
      statuses: { abc123: deviceStatusFactory() },
    });
    const updatedDevice = deviceFactory({
      hostname: "device1-newname",
      system_id: "abc123",
    });

    expect(reducers(initialState, actions.createNotify(updatedDevice))).toEqual(
      deviceStateFactory({
        items: [updatedDevice],
        statuses: {
          abc123: deviceStatusFactory(),
        },
      })
    );
  });

  it("reduces updateNotify", () => {
    const initialState = deviceStateFactory({
      items: [
        deviceFactory({ system_id: "abc123", hostname: "device1" }),
        deviceFactory({ system_id: "def456", hostname: "device2" }),
      ],
    });
    const updatedDevice = deviceFactory({
      system_id: "abc123",
      hostname: "device1-new",
    });

    expect(reducers(initialState, actions.updateNotify(updatedDevice))).toEqual(
      deviceStateFactory({
        items: [updatedDevice, initialState.items[1]],
      })
    );
  });

  it("reduces deleteNotify", () => {
    const initialState = deviceStateFactory({
      items: [
        deviceFactory({ system_id: "abc123" }),
        deviceFactory({ system_id: "def456" }),
      ],
      selected: ["abc123"],
      statuses: {
        abc123: deviceStatusFactory(),
        def456: deviceStatusFactory(),
      },
    });

    expect(reducers(initialState, actions.deleteNotify("abc123"))).toEqual(
      deviceStateFactory({
        items: [initialState.items[1]],
        selected: [],
        statuses: { def456: deviceStatusFactory() },
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

  it("reduces createPhysicalStart", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ creatingPhysical: false }),
          },
        }),
        actions.createPhysicalStart({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ creatingPhysical: true }),
        },
      })
    );
  });

  it("reduces createPhysicalError", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: deviceStatusFactory({ creatingPhysical: true }),
          },
        }),
        actions.createPhysicalError({
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
            event: "createPhysical",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: deviceStatusFactory({ creatingPhysical: false }),
        },
      })
    );
  });

  it("reduces createPhysicalSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ creatingPhysical: true }),
          },
        }),
        actions.createPhysicalSuccess({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ creatingPhysical: false }),
        },
      })
    );
  });

  it("reduces getStart", () => {
    const initialState = deviceStateFactory({ loading: false });

    expect(reducers(initialState, actions.getStart())).toEqual(
      deviceStateFactory({ loading: true })
    );
  });

  it("reduces getError", () => {
    const initialState = deviceStateFactory({ errors: null, loading: true });

    expect(
      reducers(
        initialState,
        actions.getError({ system_id: "id was not supplied" })
      )
    ).toEqual(
      deviceStateFactory({
        errors: { system_id: "id was not supplied" },
        eventErrors: [
          deviceEventErrorFactory({
            error: { system_id: "id was not supplied" },
            event: "get",
            id: null,
          }),
        ],
        loading: false,
      })
    );
  });

  it("should update if device exists on getSuccess", () => {
    const initialState = deviceStateFactory({
      items: [deviceFactory({ system_id: "abc123", hostname: "device1" })],
      loading: false,
      statuses: {
        abc123: deviceStatusFactory(),
      },
    });
    const updatedDevice = deviceDetailsFactory({
      system_id: "abc123",
      hostname: "device1-newname",
    });

    expect(reducers(initialState, actions.getSuccess(updatedDevice))).toEqual(
      deviceStateFactory({
        items: [updatedDevice],
        loading: false,
        statuses: {
          abc123: deviceStatusFactory(),
        },
      })
    );
  });

  it("reduces getSuccess", () => {
    const initialState = deviceStateFactory({
      items: [deviceFactory({ system_id: "abc123" })],
      loading: true,
      statuses: {
        abc123: deviceStatusFactory(),
      },
    });
    const newDevice = deviceDetailsFactory({ system_id: "def456" });

    expect(reducers(initialState, actions.getSuccess(newDevice))).toEqual(
      deviceStateFactory({
        items: [...initialState.items, newDevice],
        loading: false,
        statuses: {
          abc123: deviceStatusFactory(),
          def456: deviceStatusFactory(),
        },
      })
    );
  });

  it("reduces setActiveSuccess", () => {
    const initialState = deviceStateFactory({ active: null });

    expect(
      reducers(
        initialState,
        actions.setActiveSuccess(deviceDetailsFactory({ system_id: "abc123" }))
      )
    ).toEqual(deviceStateFactory({ active: "abc123" }));
  });

  it("reduces setActiveError", () => {
    const initialState = deviceStateFactory({
      active: "abc123",
      errors: null,
    });

    expect(
      reducers(initialState, actions.setActiveError("Device does not exist"))
    ).toEqual(
      deviceStateFactory({
        active: null,
        errors: "Device does not exist",
        eventErrors: [
          deviceEventErrorFactory({
            error: "Device does not exist",
            event: "setActive",
            id: null,
          }),
        ],
      })
    );
  });

  it("reduces updateInterfaceStart", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ updatingInterface: false }),
          },
        }),
        actions.updateInterfaceStart({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ updatingInterface: true }),
        },
      })
    );
  });

  it("reduces updateInterfaceError", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: deviceStatusFactory({ updatingInterface: true }),
          },
        }),
        actions.updateInterfaceError({
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
            event: "updateInterface",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: deviceStatusFactory({ updatingInterface: false }),
        },
      })
    );
  });

  it("reduces updateInterfaceSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ updatingInterface: true }),
          },
        }),
        actions.updateInterfaceSuccess({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ updatingInterface: false }),
        },
      })
    );
  });

  it("reduces deleteStart", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ deleting: false }),
          },
        }),
        actions.deleteStart({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ deleting: true }),
        },
      })
    );
  });

  it("reduces deleteError", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: deviceStatusFactory({ deleting: true }),
          },
        }),
        actions.deleteError({
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
            event: "delete",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: deviceStatusFactory({ deleting: false }),
        },
      })
    );
  });

  it("reduces deleteSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ deleting: true }),
          },
        }),
        actions.deleteSuccess({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ deleting: false }),
        },
      })
    );
  });

  it("reduces setZoneStart", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ settingZone: false }),
          },
        }),
        actions.setZoneStart({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ settingZone: true }),
        },
      })
    );
  });

  it("reduces setZoneError", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: deviceStatusFactory({ settingZone: true }),
          },
        }),
        actions.setZoneError({
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
            event: "setZone",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: deviceStatusFactory({ settingZone: false }),
        },
      })
    );
  });

  it("reduces setZoneSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ settingZone: true }),
          },
        }),
        actions.setZoneSuccess({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ settingZone: false }),
        },
      })
    );
  });

  it("reduces linkSubnetStart", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ linkingSubnet: false }),
          },
        }),
        actions.linkSubnetStart({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ linkingSubnet: true }),
        },
      })
    );
  });

  it("reduces linkSubnetError", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: deviceStatusFactory({ linkingSubnet: true }),
          },
        }),
        actions.linkSubnetError({
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
            event: "linkSubnet",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: deviceStatusFactory({ linkingSubnet: false }),
        },
      })
    );
  });

  it("reduces linkSubnetSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ linkingSubnet: true }),
          },
        }),
        actions.linkSubnetSuccess({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ linkingSubnet: false }),
        },
      })
    );
  });

  it("reduces unlinkSubnetStart", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ unlinkingSubnet: false }),
          },
        }),
        actions.unlinkSubnetStart({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ unlinkingSubnet: true }),
        },
      })
    );
  });

  it("reduces unlinkSubnetError", () => {
    expect(
      reducers(
        deviceStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: deviceStatusFactory({ unlinkingSubnet: true }),
          },
        }),
        actions.unlinkSubnetError({
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
            event: "unlinkSubnet",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: deviceStatusFactory({ unlinkingSubnet: false }),
        },
      })
    );
  });

  it("reduces unlinkSubnetSuccess", () => {
    expect(
      reducers(
        deviceStateFactory({
          statuses: {
            abc123: deviceStatusFactory({ unlinkingSubnet: true }),
          },
        }),
        actions.unlinkSubnetSuccess({
          item: {
            [DeviceMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      deviceStateFactory({
        statuses: {
          abc123: deviceStatusFactory({ unlinkingSubnet: false }),
        },
      })
    );
  });
});
