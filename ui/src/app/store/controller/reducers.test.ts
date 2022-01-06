import reducers, { actions } from "./slice";
import { ControllerMeta } from "./types";

import {
  controller as controllerFactory,
  controllerDetails as controllerDetailsFactory,
  controllerEventError as controllerEventErrorFactory,
  controllerStatus as controllerStatusFactory,
  controllerState as controllerStateFactory,
} from "testing/factories";

describe("controller reducers", () => {
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
      controllerStateFactory({
        loaded: false,
        loading: true,
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const controllers = [controllerFactory(), controllerFactory()];
    expect(
      reducers(
        controllerStateFactory({
          items: [],
          loaded: false,
          loading: true,
        }),
        actions.fetchSuccess(controllers)
      )
    ).toEqual(
      controllerStateFactory({
        loading: false,
        loaded: true,
        items: controllers,
        statuses: {
          [controllers[0][ControllerMeta.PK]]: controllerStatusFactory(),
          [controllers[1][ControllerMeta.PK]]: controllerStatusFactory(),
        },
      })
    );
  });

  it("reduces createNotify", () => {
    const initialState = controllerStateFactory({
      items: [controllerFactory({ system_id: "abc123" })],
      statuses: { abc123: controllerStatusFactory() },
    });
    const newController = controllerFactory({ system_id: "def456" });

    expect(reducers(initialState, actions.createNotify(newController))).toEqual(
      controllerStateFactory({
        items: [...initialState.items, newController],
        statuses: {
          abc123: controllerStatusFactory(),
          def456: controllerStatusFactory(),
        },
      })
    );
  });

  it("should update if controller exists on createNotify", () => {
    const initialState = controllerStateFactory({
      items: [
        controllerFactory({ hostname: "controller1", system_id: "abc123" }),
      ],
      statuses: { abc123: controllerStatusFactory() },
    });
    const updatedController = controllerFactory({
      hostname: "controller1-newname",
      system_id: "abc123",
    });

    expect(
      reducers(initialState, actions.createNotify(updatedController))
    ).toEqual(
      controllerStateFactory({
        items: [updatedController],
        statuses: {
          abc123: controllerStatusFactory(),
        },
      })
    );
  });

  it("reduces updateNotify", () => {
    const initialState = controllerStateFactory({
      items: [
        controllerFactory({ system_id: "abc123", hostname: "controller1" }),
        controllerFactory({ system_id: "def456", hostname: "controller2" }),
      ],
    });
    const updatedController = controllerFactory({
      system_id: "abc123",
      hostname: "controller1-new",
    });

    expect(
      reducers(initialState, actions.updateNotify(updatedController))
    ).toEqual(
      controllerStateFactory({
        items: [updatedController, initialState.items[1]],
      })
    );
  });

  it("reduces deleteNotify", () => {
    const initialState = controllerStateFactory({
      items: [
        controllerFactory({ system_id: "abc123" }),
        controllerFactory({ system_id: "def456" }),
      ],
      selected: ["abc123"],
      statuses: {
        abc123: controllerStatusFactory(),
        def456: controllerStatusFactory(),
      },
    });

    expect(reducers(initialState, actions.deleteNotify("abc123"))).toEqual(
      controllerStateFactory({
        items: [initialState.items[1]],
        selected: [],
        statuses: { def456: controllerStatusFactory() },
      })
    );
  });

  it("reduces getStart", () => {
    const initialState = controllerStateFactory({ loading: false });

    expect(reducers(initialState, actions.getStart())).toEqual(
      controllerStateFactory({ loading: true })
    );
  });

  it("reduces getError", () => {
    const initialState = controllerStateFactory({
      errors: null,
      loading: true,
    });

    expect(
      reducers(
        initialState,
        actions.getError({ system_id: "id was not supplied" })
      )
    ).toEqual(
      controllerStateFactory({
        errors: { system_id: "id was not supplied" },
        eventErrors: [
          controllerEventErrorFactory({
            error: { system_id: "id was not supplied" },
            event: "get",
            id: null,
          }),
        ],
        loading: false,
      })
    );
  });

  it("should update if controller exists on getSuccess", () => {
    const initialState = controllerStateFactory({
      items: [
        controllerFactory({ system_id: "abc123", hostname: "controller1" }),
      ],
      loading: false,
      statuses: {
        abc123: controllerStatusFactory(),
      },
    });
    const updatedController = controllerDetailsFactory({
      system_id: "abc123",
      hostname: "controller1-newname",
    });

    expect(
      reducers(initialState, actions.getSuccess(updatedController))
    ).toEqual(
      controllerStateFactory({
        items: [updatedController],
        loading: false,
        statuses: {
          abc123: controllerStatusFactory(),
        },
      })
    );
  });

  it("reduces getSuccess", () => {
    const initialState = controllerStateFactory({
      items: [controllerFactory({ system_id: "abc123" })],
      loading: true,
      statuses: {
        abc123: controllerStatusFactory(),
      },
    });
    const newController = controllerDetailsFactory({ system_id: "def456" });

    expect(reducers(initialState, actions.getSuccess(newController))).toEqual(
      controllerStateFactory({
        items: [...initialState.items, newController],
        loading: false,
        statuses: {
          abc123: controllerStatusFactory(),
          def456: controllerStatusFactory(),
        },
      })
    );
  });

  it("reduces setActiveSuccess", () => {
    const initialState = controllerStateFactory({ active: null });

    expect(
      reducers(
        initialState,
        actions.setActiveSuccess(
          controllerDetailsFactory({ system_id: "abc123" })
        )
      )
    ).toEqual(controllerStateFactory({ active: "abc123" }));
  });

  it("reduces setActiveError", () => {
    const initialState = controllerStateFactory({
      active: "abc123",
      errors: null,
    });

    expect(
      reducers(
        initialState,
        actions.setActiveError("Controller does not exist")
      )
    ).toEqual(
      controllerStateFactory({
        active: null,
        errors: "Controller does not exist",
        eventErrors: [
          controllerEventErrorFactory({
            error: "Controller does not exist",
            event: "setActive",
            id: null,
          }),
        ],
      })
    );
  });

  it("reduces deleteStart", () => {
    expect(
      reducers(
        controllerStateFactory({
          statuses: {
            abc123: controllerStatusFactory({ deleting: false }),
          },
        }),
        actions.deleteStart({
          item: {
            [ControllerMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      controllerStateFactory({
        statuses: {
          abc123: controllerStatusFactory({ deleting: true }),
        },
      })
    );
  });

  it("reduces deleteError", () => {
    expect(
      reducers(
        controllerStateFactory({
          errors: "It's realllll bad",
          eventErrors: [],
          statuses: {
            abc123: controllerStatusFactory({ deleting: true }),
          },
        }),
        actions.deleteError({
          error: true,
          item: {
            [ControllerMeta.PK]: "abc123",
          },
          payload: "It's realllll bad",
        })
      )
    ).toEqual(
      controllerStateFactory({
        errors: "It's realllll bad",
        eventErrors: [
          controllerEventErrorFactory({
            error: "It's realllll bad",
            event: "delete",
            id: "abc123",
          }),
        ],
        statuses: {
          abc123: controllerStatusFactory({ deleting: false }),
        },
      })
    );
  });

  it("reduces deleteSuccess", () => {
    expect(
      reducers(
        controllerStateFactory({
          statuses: {
            abc123: controllerStatusFactory({ deleting: true }),
          },
        }),
        actions.deleteSuccess({
          item: {
            [ControllerMeta.PK]: "abc123",
          },
        })
      )
    ).toEqual(
      controllerStateFactory({
        statuses: {
          abc123: controllerStatusFactory({ deleting: false }),
        },
      })
    );
  });
});
