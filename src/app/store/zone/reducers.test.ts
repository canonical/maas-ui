import { ZONE_ACTIONS } from "./constants";
import reducers, {
  actions,
  initialGenericActions,
  initialModelActions,
} from "./slice";
import { ZoneMeta } from "./types";

import { ACTION_STATUS } from "app/base/constants";
import {
  zone as zoneFactory,
  zoneError as zoneErrorFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneModelAction as zoneModelActionFactory,
  zoneModelActions as zoneModelActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

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
      zoneErrorFactory({ action: ZONE_ACTIONS.delete }),
      zoneErrorFactory({ action: ZONE_ACTIONS.fetch }),
    ];
    const initialState = zoneStateFactory({
      errors: [deleteError, fetchError],
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
      }),
      modelActions: zoneModelActionsFactory({
        [ZONE_ACTIONS.delete]: zoneModelActionFactory({
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
      zoneStateFactory({
        errors: [fetchError],
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
        }),
        modelActions: zoneModelActionsFactory({
          [ZONE_ACTIONS.delete]: zoneModelActionFactory({
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
    const initialState = zoneStateFactory({
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.idle,
      }),
    });

    expect(reducers(initialState, actions.createStart())).toEqual(
      zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.create]: ACTION_STATUS.loading,
        }),
      })
    );
  });

  it("reduces createSuccess", () => {
    const initialState = zoneStateFactory({
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.loading,
      }),
    });

    expect(reducers(initialState, actions.createSuccess())).toEqual(
      zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.create]: ACTION_STATUS.success,
        }),
      })
    );
  });

  it("reduces createError", () => {
    const initialState = zoneStateFactory({
      errors: [],
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.loading,
      }),
    });
    const errorMessage = "Unable to create zone";

    expect(reducers(initialState, actions.createError(errorMessage))).toEqual(
      zoneStateFactory({
        errors: [
          zoneErrorFactory({
            action: ZONE_ACTIONS.create,
            error: errorMessage,
          }),
        ],
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.create]: ACTION_STATUS.error,
        }),
      })
    );
  });

  it("reduces createNotify", () => {
    const initialState = zoneStateFactory({
      items: [zoneFactory()],
    });
    const createdZone = zoneFactory();

    expect(reducers(initialState, actions.createNotify(createdZone))).toEqual(
      zoneStateFactory({
        items: [...initialState.items, createdZone],
      })
    );
  });
});

describe("fetch", () => {
  it("reduces fetchStart", () => {
    const initialState = zoneStateFactory({
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.idle,
      }),
    });

    expect(reducers(initialState, actions.fetchStart())).toEqual(
      zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.loading,
        }),
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const initialState = zoneStateFactory({
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.loading,
      }),
      items: [],
    });
    const fetchedZones = [zoneFactory(), zoneFactory()];

    expect(reducers(initialState, actions.fetchSuccess(fetchedZones))).toEqual(
      zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
        }),
        items: fetchedZones,
      })
    );
  });

  it("reduces fetchError", () => {
    const initialState = zoneStateFactory({
      errors: [],
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.loading,
      }),
    });
    const errorMessage = "Unable to fetch zones";

    expect(reducers(initialState, actions.fetchError(errorMessage))).toEqual(
      zoneStateFactory({
        errors: [
          zoneErrorFactory({
            action: ZONE_ACTIONS.fetch,
            error: errorMessage,
          }),
        ],
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.error,
        }),
      })
    );
  });
});

describe("update", () => {
  it("reduces updateStart", () => {
    const initialState = zoneStateFactory({
      modelActions: zoneModelActionsFactory({
        [ZONE_ACTIONS.update]: zoneModelActionFactory({
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
      zoneStateFactory({
        modelActions: zoneModelActionsFactory({
          [ZONE_ACTIONS.update]: zoneModelActionFactory({
            [ACTION_STATUS.loading]: [123],
          }),
        }),
      })
    );
  });

  it("reduces updateSuccess", () => {
    const zone = zoneFactory({ id: 123 });
    const initialState = zoneStateFactory({
      items: [],
      modelActions: zoneModelActionsFactory({
        [ZONE_ACTIONS.update]: zoneModelActionFactory({
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
      zoneStateFactory({
        modelActions: zoneModelActionsFactory({
          [ZONE_ACTIONS.update]: zoneModelActionFactory({
            [ACTION_STATUS.loading]: [],
            [ACTION_STATUS.success]: [123],
          }),
        }),
      })
    );
  });

  it("reduces updateError", () => {
    const initialState = zoneStateFactory({
      errors: [],
      modelActions: zoneModelActionsFactory({
        [ZONE_ACTIONS.update]: zoneModelActionFactory({
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
      zoneStateFactory({
        errors: [
          zoneErrorFactory({
            action: ZONE_ACTIONS.update,
            error: errorMessage,
            identifier: 123,
          }),
        ],
        modelActions: zoneModelActionsFactory({
          [ZONE_ACTIONS.update]: zoneModelActionFactory({
            [ACTION_STATUS.error]: [123],
            [ACTION_STATUS.loading]: [],
          }),
        }),
      })
    );
  });

  it("reduces updateNotify", () => {
    const initialState = zoneStateFactory({
      items: [zoneFactory({ [ZoneMeta.PK]: 123, name: "danger" })],
    });
    const updatedZone = zoneFactory({ [ZoneMeta.PK]: 123, name: "twilight" });

    expect(reducers(initialState, actions.updateNotify(updatedZone))).toEqual(
      zoneStateFactory({
        items: [updatedZone],
      })
    );
  });
});

describe("delete", () => {
  it("reduces deleteStart", () => {
    const initialState = zoneStateFactory({
      modelActions: zoneModelActionsFactory({
        [ZONE_ACTIONS.delete]: zoneModelActionFactory({
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
      zoneStateFactory({
        modelActions: zoneModelActionsFactory({
          [ZONE_ACTIONS.delete]: zoneModelActionFactory({
            [ACTION_STATUS.loading]: [123],
          }),
        }),
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const initialState = zoneStateFactory({
      modelActions: zoneModelActionsFactory({
        [ZONE_ACTIONS.delete]: zoneModelActionFactory({
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
      zoneStateFactory({
        modelActions: zoneModelActionsFactory({
          [ZONE_ACTIONS.delete]: zoneModelActionFactory({
            [ACTION_STATUS.loading]: [],
            [ACTION_STATUS.success]: [123],
          }),
        }),
      })
    );
  });

  it("reduces deleteError", () => {
    const initialState = zoneStateFactory({
      errors: [],
      modelActions: zoneModelActionsFactory({
        [ZONE_ACTIONS.delete]: zoneModelActionFactory({
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
      zoneStateFactory({
        errors: [
          zoneErrorFactory({
            action: ZONE_ACTIONS.delete,
            error: errorMessage,
            identifier: 123,
          }),
        ],
        modelActions: zoneModelActionsFactory({
          [ZONE_ACTIONS.delete]: zoneModelActionFactory({
            [ACTION_STATUS.error]: [123],
            [ACTION_STATUS.loading]: [],
          }),
        }),
      })
    );
  });

  it("reduces deleteNotify", () => {
    const initialState = zoneStateFactory({
      items: [zoneFactory({ [ZoneMeta.PK]: 123 })],
    });

    expect(reducers(initialState, actions.deleteNotify(123))).toEqual(
      zoneStateFactory({
        items: [],
      })
    );
  });
});
