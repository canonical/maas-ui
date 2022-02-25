import { ACTION_STATUS, ZONE_ACTIONS, ZONE_PK } from "./constants";
import reducers, { actions } from "./slice";

import {
  zone as zoneFactory,
  zoneError as errorFactory,
  zoneGenericActions as genericActionsFactory,
  zoneModelAction as modelActionFactory,
  zoneModelActions as modelActionsFactory,
  zoneState as stateFactory,
} from "testing/factories";

it("returns the initial state", () => {
  expect(reducers(undefined, { type: "" })).toEqual({
    errors: [],
    genericActions: {
      [ZONE_ACTIONS.create]: ACTION_STATUS.idle,
      [ZONE_ACTIONS.fetch]: ACTION_STATUS.idle,
    },
    items: [],
    modelActions: {
      [ZONE_ACTIONS.delete]: {
        [ACTION_STATUS.failed]: [],
        [ACTION_STATUS.processing]: [],
        [ACTION_STATUS.successful]: [],
      },
      [ZONE_ACTIONS.update]: {
        [ACTION_STATUS.failed]: [],
        [ACTION_STATUS.processing]: [],
        [ACTION_STATUS.successful]: [],
      },
    },
  });
});

describe("cleanup", () => {
  it("does not clear fetch action status", () => {
    const initialState = stateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.successful,
      }),
    });

    expect(reducers(initialState, actions.cleanup())).toEqual(initialState);
  });

  it("clears all errors and non-fetch action statuses", () => {
    const initialState = stateFactory({
      errors: [errorFactory()],
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.failed,
      }),
      modelActions: modelActionsFactory({
        [ZONE_ACTIONS.update]: modelActionFactory({
          [ACTION_STATUS.failed]: [1],
          [ACTION_STATUS.processing]: [2],
          [ACTION_STATUS.successful]: [3],
        }),
      }),
    });

    expect(reducers(initialState, actions.cleanup())).toEqual(
      stateFactory({
        errors: [],
        genericActions: genericActionsFactory({
          [ZONE_ACTIONS.create]: ACTION_STATUS.idle,
        }),
        modelActions: modelActionsFactory({
          [ZONE_ACTIONS.update]: modelActionFactory({
            [ACTION_STATUS.failed]: [],
            [ACTION_STATUS.processing]: [],
            [ACTION_STATUS.successful]: [],
          }),
        }),
      })
    );
  });
});

describe("create", () => {
  it("reduces createStart", () => {
    const initialState = stateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.idle,
      }),
    });

    expect(reducers(initialState, actions.createStart())).toEqual(
      stateFactory({
        genericActions: genericActionsFactory({
          [ZONE_ACTIONS.create]: ACTION_STATUS.processing,
        }),
      })
    );
  });

  it("reduces createSuccess", () => {
    const initialState = stateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.processing,
      }),
    });

    expect(reducers(initialState, actions.createSuccess())).toEqual(
      stateFactory({
        genericActions: genericActionsFactory({
          [ZONE_ACTIONS.create]: ACTION_STATUS.successful,
        }),
      })
    );
  });

  it("reduces createError", () => {
    const initialState = stateFactory({
      errors: [],
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.processing,
      }),
    });
    const errorMessage = "Unable to create zone";

    expect(reducers(initialState, actions.createError(errorMessage))).toEqual(
      stateFactory({
        errors: [
          errorFactory({
            action: ZONE_ACTIONS.create,
            error: errorMessage,
          }),
        ],
        genericActions: genericActionsFactory({
          [ZONE_ACTIONS.create]: ACTION_STATUS.failed,
        }),
      })
    );
  });

  it("reduces createNotify", () => {
    const initialState = stateFactory({
      items: [zoneFactory()],
    });
    const createdZone = zoneFactory();

    expect(reducers(initialState, actions.createNotify(createdZone))).toEqual(
      stateFactory({
        items: [...initialState.items, createdZone],
      })
    );
  });
});

describe("fetch", () => {
  it("reduces fetchStart", () => {
    const initialState = stateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.idle,
      }),
    });

    expect(reducers(initialState, actions.fetchStart())).toEqual(
      stateFactory({
        genericActions: genericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.processing,
        }),
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const initialState = stateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.processing,
      }),
      items: [],
    });
    const fetchedZones = [zoneFactory(), zoneFactory()];

    expect(reducers(initialState, actions.fetchSuccess(fetchedZones))).toEqual(
      stateFactory({
        genericActions: genericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.successful,
        }),
        items: fetchedZones,
      })
    );
  });

  it("reduces fetchError", () => {
    const initialState = stateFactory({
      errors: [],
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.processing,
      }),
    });
    const errorMessage = "Unable to fetch zones";

    expect(reducers(initialState, actions.fetchError(errorMessage))).toEqual(
      stateFactory({
        errors: [
          errorFactory({
            action: ZONE_ACTIONS.fetch,
            error: errorMessage,
          }),
        ],
        genericActions: genericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.failed,
        }),
      })
    );
  });
});

describe("update", () => {
  it("reduces updateStart", () => {
    const initialState = stateFactory({
      modelActions: modelActionsFactory({
        [ZONE_ACTIONS.update]: modelActionFactory({
          [ACTION_STATUS.processing]: [],
        }),
      }),
    });

    expect(
      reducers(initialState, actions.updateStart({ meta: { modelPK: 123 } }))
    ).toEqual(
      stateFactory({
        modelActions: modelActionsFactory({
          [ZONE_ACTIONS.update]: modelActionFactory({
            [ACTION_STATUS.processing]: [123],
          }),
        }),
      })
    );
  });

  it("reduces updateSuccess", () => {
    const initialState = stateFactory({
      modelActions: modelActionsFactory({
        [ZONE_ACTIONS.update]: modelActionFactory({
          [ACTION_STATUS.processing]: [123],
          [ACTION_STATUS.successful]: [],
        }),
      }),
    });

    expect(
      reducers(initialState, actions.updateSuccess({ meta: { modelPK: 123 } }))
    ).toEqual(
      stateFactory({
        modelActions: modelActionsFactory({
          [ZONE_ACTIONS.update]: modelActionFactory({
            [ACTION_STATUS.processing]: [],
            [ACTION_STATUS.successful]: [123],
          }),
        }),
      })
    );
  });

  it("reduces updateFailed", () => {
    const initialState = stateFactory({
      errors: [],
      modelActions: modelActionsFactory({
        [ZONE_ACTIONS.update]: modelActionFactory({
          [ACTION_STATUS.failed]: [],
          [ACTION_STATUS.processing]: [123],
        }),
      }),
    });
    const errorMessage = "Unable to update zone";

    expect(
      reducers(
        initialState,
        actions.updateError({ meta: { modelPK: 123 }, payload: errorMessage })
      )
    ).toEqual(
      stateFactory({
        errors: [
          errorFactory({
            action: ZONE_ACTIONS.update,
            error: errorMessage,
            modelPK: 123,
          }),
        ],
        modelActions: modelActionsFactory({
          [ZONE_ACTIONS.update]: modelActionFactory({
            [ACTION_STATUS.failed]: [123],
            [ACTION_STATUS.processing]: [],
          }),
        }),
      })
    );
  });

  it("reduces updateNotify", () => {
    const initialState = stateFactory({
      items: [zoneFactory({ [ZONE_PK]: 123, name: "danger" })],
    });
    const updatedZone = zoneFactory({ [ZONE_PK]: 123, name: "twilight" });

    expect(reducers(initialState, actions.updateNotify(updatedZone))).toEqual(
      stateFactory({
        items: [updatedZone],
      })
    );
  });
});

describe("delete", () => {
  it("reduces deleteStart", () => {
    const initialState = stateFactory({
      modelActions: modelActionsFactory({
        [ZONE_ACTIONS.delete]: modelActionFactory({
          [ACTION_STATUS.processing]: [],
        }),
      }),
    });

    expect(
      reducers(initialState, actions.deleteStart({ meta: { modelPK: 123 } }))
    ).toEqual(
      stateFactory({
        modelActions: modelActionsFactory({
          [ZONE_ACTIONS.delete]: modelActionFactory({
            [ACTION_STATUS.processing]: [123],
          }),
        }),
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const initialState = stateFactory({
      modelActions: modelActionsFactory({
        [ZONE_ACTIONS.delete]: modelActionFactory({
          [ACTION_STATUS.processing]: [123],
          [ACTION_STATUS.successful]: [],
        }),
      }),
    });

    expect(
      reducers(initialState, actions.deleteSuccess({ meta: { modelPK: 123 } }))
    ).toEqual(
      stateFactory({
        modelActions: modelActionsFactory({
          [ZONE_ACTIONS.delete]: modelActionFactory({
            [ACTION_STATUS.processing]: [],
            [ACTION_STATUS.successful]: [123],
          }),
        }),
      })
    );
  });

  it("reduces deleteFailed", () => {
    const initialState = stateFactory({
      errors: [],
      modelActions: modelActionsFactory({
        [ZONE_ACTIONS.delete]: modelActionFactory({
          [ACTION_STATUS.failed]: [],
          [ACTION_STATUS.processing]: [123],
        }),
      }),
    });
    const errorMessage = "Unable to delete zone";

    expect(
      reducers(
        initialState,
        actions.deleteError({ meta: { modelPK: 123 }, payload: errorMessage })
      )
    ).toEqual(
      stateFactory({
        errors: [
          errorFactory({
            action: ZONE_ACTIONS.delete,
            error: errorMessage,
            modelPK: 123,
          }),
        ],
        modelActions: modelActionsFactory({
          [ZONE_ACTIONS.delete]: modelActionFactory({
            [ACTION_STATUS.failed]: [123],
            [ACTION_STATUS.processing]: [],
          }),
        }),
      })
    );
  });

  it("reduces deleteNotify", () => {
    const initialState = stateFactory({
      items: [zoneFactory({ [ZONE_PK]: 123 })],
    });

    expect(reducers(initialState, actions.deleteNotify(123))).toEqual(
      stateFactory({
        items: [],
      })
    );
  });
});
