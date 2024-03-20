import { ZONE_ACTIONS } from "./constants";
import reducers, {
  actions,
  initialGenericActions,
  initialModelActions,
} from "./slice";
import { ZoneMeta } from "./types";

import { ACTION_STATUS } from "@/app/base/constants";
import * as factory from "@/testing/factories";

it("returns the initial state", () => {
  expect(reducers(undefined, { type: "" })).toEqual({
    errors: [],
    genericActions: initialGenericActions,
    items: [],
    modelActions: initialModelActions,
  });
});

describe("cleanup", () => {
  it("clears errors and statuses for given action names", () => {
    const [deleteError, fetchError] = [
      factory.zoneError({ action: ZONE_ACTIONS.delete }),
      factory.zoneError({ action: ZONE_ACTIONS.fetch }),
    ];
    const initialState = factory.zoneState({
      errors: [deleteError, fetchError],
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
      }),
      modelActions: factory.zoneModelActions({
        [ZONE_ACTIONS.delete]: factory.zoneModelAction({
          [ACTION_STATUS.error]: [1],
          [ACTION_STATUS.loading]: [2],
          [ACTION_STATUS.success]: [3],
        }),
      }),
    });

    expect(
      // Only clear delete errors and statuses
      reducers(initialState, actions.cleanup([ZONE_ACTIONS.delete]))
    ).toEqual(
      factory.zoneState({
        errors: [fetchError],
        genericActions: factory.zoneGenericActions({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
        }),
        modelActions: factory.zoneModelActions({
          [ZONE_ACTIONS.delete]: factory.zoneModelAction({
            [ACTION_STATUS.error]: [],
            [ACTION_STATUS.loading]: [],
            [ACTION_STATUS.success]: [],
          }),
        }),
      })
    );
  });
});

describe("create", () => {
  it("reduces createStart", () => {
    const initialState = factory.zoneState({
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.create]: ACTION_STATUS.idle,
      }),
    });

    expect(reducers(initialState, actions.createStart())).toEqual(
      factory.zoneState({
        genericActions: factory.zoneGenericActions({
          [ZONE_ACTIONS.create]: ACTION_STATUS.loading,
        }),
      })
    );
  });

  it("reduces createSuccess", () => {
    const initialState = factory.zoneState({
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.create]: ACTION_STATUS.loading,
      }),
    });

    expect(reducers(initialState, actions.createSuccess())).toEqual(
      factory.zoneState({
        genericActions: factory.zoneGenericActions({
          [ZONE_ACTIONS.create]: ACTION_STATUS.success,
        }),
      })
    );
  });

  it("reduces createError", () => {
    const initialState = factory.zoneState({
      errors: [],
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.create]: ACTION_STATUS.loading,
      }),
    });
    const errorMessage = "Unable to create zone";

    expect(reducers(initialState, actions.createError(errorMessage))).toEqual(
      factory.zoneState({
        errors: [
          factory.zoneError({
            action: ZONE_ACTIONS.create,
            error: errorMessage,
          }),
        ],
        genericActions: factory.zoneGenericActions({
          [ZONE_ACTIONS.create]: ACTION_STATUS.error,
        }),
      })
    );
  });

  it("reduces createNotify", () => {
    const initialState = factory.zoneState({
      items: [factory.zone()],
    });
    const createdZone = factory.zone();

    expect(reducers(initialState, actions.createNotify(createdZone))).toEqual(
      factory.zoneState({
        items: [...initialState.items, createdZone],
      })
    );
  });
});

describe("fetch", () => {
  it("reduces fetchStart", () => {
    const initialState = factory.zoneState({
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.idle,
      }),
    });

    expect(reducers(initialState, actions.fetchStart())).toEqual(
      factory.zoneState({
        genericActions: factory.zoneGenericActions({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.loading,
        }),
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const initialState = factory.zoneState({
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.loading,
      }),
      items: [],
    });
    const fetchedZones = [factory.zone(), factory.zone()];

    expect(reducers(initialState, actions.fetchSuccess(fetchedZones))).toEqual(
      factory.zoneState({
        genericActions: factory.zoneGenericActions({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
        }),
        items: fetchedZones,
      })
    );
  });

  it("reduces fetchError", () => {
    const initialState = factory.zoneState({
      errors: [],
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.loading,
      }),
    });
    const errorMessage = "Unable to fetch zones";

    expect(reducers(initialState, actions.fetchError(errorMessage))).toEqual(
      factory.zoneState({
        errors: [
          factory.zoneError({
            action: ZONE_ACTIONS.fetch,
            error: errorMessage,
          }),
        ],
        genericActions: factory.zoneGenericActions({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.error,
        }),
      })
    );
  });
});

describe("update", () => {
  it("reduces updateStart", () => {
    const initialState = factory.zoneState({
      modelActions: factory.zoneModelActions({
        [ZONE_ACTIONS.update]: factory.zoneModelAction({
          [ACTION_STATUS.loading]: [],
        }),
      }),
    });

    expect(
      reducers(
        initialState,
        actions.updateStart({
          meta: { identifier: 123 },
          payload: null,
          type: "updateStart",
        })
      )
    ).toEqual(
      factory.zoneState({
        modelActions: factory.zoneModelActions({
          [ZONE_ACTIONS.update]: factory.zoneModelAction({
            [ACTION_STATUS.loading]: [123],
          }),
        }),
      })
    );
  });

  it("reduces updateSuccess", () => {
    const zone = factory.zone({ id: 123 });
    const initialState = factory.zoneState({
      items: [],
      modelActions: factory.zoneModelActions({
        [ZONE_ACTIONS.update]: factory.zoneModelAction({
          [ACTION_STATUS.loading]: [123],
          [ACTION_STATUS.success]: [],
        }),
      }),
    });

    expect(
      reducers(
        initialState,
        actions.updateSuccess({
          meta: { identifier: 123 },
          payload: zone,
          type: "updateSuccess",
        })
      )
    ).toEqual(
      factory.zoneState({
        modelActions: factory.zoneModelActions({
          [ZONE_ACTIONS.update]: factory.zoneModelAction({
            [ACTION_STATUS.loading]: [],
            [ACTION_STATUS.success]: [123],
          }),
        }),
      })
    );
  });

  it("reduces updateError", () => {
    const initialState = factory.zoneState({
      errors: [],
      modelActions: factory.zoneModelActions({
        [ZONE_ACTIONS.update]: factory.zoneModelAction({
          [ACTION_STATUS.error]: [],
          [ACTION_STATUS.loading]: [123],
        }),
      }),
    });
    const errorMessage = "Unable to update zone";

    expect(
      reducers(
        initialState,
        actions.updateError({
          meta: { identifier: 123 },
          payload: errorMessage,
          type: "updateError",
        })
      )
    ).toEqual(
      factory.zoneState({
        errors: [
          factory.zoneError({
            action: ZONE_ACTIONS.update,
            error: errorMessage,
            identifier: 123,
          }),
        ],
        modelActions: factory.zoneModelActions({
          [ZONE_ACTIONS.update]: factory.zoneModelAction({
            [ACTION_STATUS.error]: [123],
            [ACTION_STATUS.loading]: [],
          }),
        }),
      })
    );
  });

  it("reduces updateNotify", () => {
    const initialState = factory.zoneState({
      items: [factory.zone({ [ZoneMeta.PK]: 123, name: "danger" })],
    });
    const updatedZone = factory.zone({ [ZoneMeta.PK]: 123, name: "twilight" });

    expect(reducers(initialState, actions.updateNotify(updatedZone))).toEqual(
      factory.zoneState({
        items: [updatedZone],
      })
    );
  });
});

describe("delete", () => {
  it("reduces deleteStart", () => {
    const initialState = factory.zoneState({
      modelActions: factory.zoneModelActions({
        [ZONE_ACTIONS.delete]: factory.zoneModelAction({
          [ACTION_STATUS.loading]: [],
        }),
      }),
    });

    expect(
      reducers(
        initialState,
        actions.deleteStart({
          meta: { identifier: 123 },
          payload: null,
          type: "deleteStart",
        })
      )
    ).toEqual(
      factory.zoneState({
        modelActions: factory.zoneModelActions({
          [ZONE_ACTIONS.delete]: factory.zoneModelAction({
            [ACTION_STATUS.loading]: [123],
          }),
        }),
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const initialState = factory.zoneState({
      modelActions: factory.zoneModelActions({
        [ZONE_ACTIONS.delete]: factory.zoneModelAction({
          [ACTION_STATUS.loading]: [123],
          [ACTION_STATUS.success]: [],
        }),
      }),
    });

    expect(
      reducers(
        initialState,
        actions.deleteSuccess({
          meta: { identifier: 123 },
          payload: 123,
          type: "deleteSuccess",
        })
      )
    ).toEqual(
      factory.zoneState({
        modelActions: factory.zoneModelActions({
          [ZONE_ACTIONS.delete]: factory.zoneModelAction({
            [ACTION_STATUS.loading]: [],
            [ACTION_STATUS.success]: [123],
          }),
        }),
      })
    );
  });

  it("reduces deleteError", () => {
    const initialState = factory.zoneState({
      errors: [],
      modelActions: factory.zoneModelActions({
        [ZONE_ACTIONS.delete]: factory.zoneModelAction({
          [ACTION_STATUS.error]: [],
          [ACTION_STATUS.loading]: [123],
        }),
      }),
    });
    const errorMessage = "Unable to delete zone";

    expect(
      reducers(
        initialState,
        actions.deleteError({
          meta: { identifier: 123 },
          payload: errorMessage,
          type: "deleteError",
        })
      )
    ).toEqual(
      factory.zoneState({
        errors: [
          factory.zoneError({
            action: ZONE_ACTIONS.delete,
            error: errorMessage,
            identifier: 123,
          }),
        ],
        modelActions: factory.zoneModelActions({
          [ZONE_ACTIONS.delete]: factory.zoneModelAction({
            [ACTION_STATUS.error]: [123],
            [ACTION_STATUS.loading]: [],
          }),
        }),
      })
    );
  });

  it("reduces deleteNotify", () => {
    const initialState = factory.zoneState({
      items: [factory.zone({ [ZoneMeta.PK]: 123 })],
    });

    expect(reducers(initialState, actions.deleteNotify(123))).toEqual(
      factory.zoneState({
        items: [],
      })
    );
  });
});
