import reducers, { actions } from "./slice";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      active: null,
      errors: null,
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
    const initialState = machineStateFactory({ loading: false });

    expect(reducers(initialState, actions.fetchStart())).toEqual(
      machineStateFactory({
        loading: true,
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const initialState = machineStateFactory({
      items: [],
      loading: true,
      loaded: false,
      statuses: {},
    });
    const fetchedMachines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];

    expect(
      reducers(initialState, actions.fetchSuccess(fetchedMachines))
    ).toEqual(
      machineStateFactory({
        items: fetchedMachines,
        loading: true,
        loaded: false,
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("reduces fetchComplete", () => {
    const initialState = machineStateFactory({
      loaded: false,
      loading: true,
    });

    expect(reducers(initialState, actions.fetchComplete())).toEqual(
      machineStateFactory({
        loaded: true,
        loading: false,
      })
    );
  });

  it("reduces fetchError", () => {
    const initialState = machineStateFactory({
      errors: null,
      loaded: false,
      loading: true,
    });

    expect(
      reducers(initialState, actions.fetchError("Could not fetch machines"))
    ).toEqual(
      machineStateFactory({
        errors: "Could not fetch machines",
        loaded: false,
        loading: false,
      })
    );
  });

  it("reduces getStart", () => {
    const initialState = machineStateFactory({ loading: false });

    expect(reducers(initialState, actions.getStart())).toEqual(
      machineStateFactory({ loading: true })
    );
  });

  it("reduces getError", () => {
    const initialState = machineStateFactory({ errors: null, loading: true });

    expect(
      reducers(
        initialState,
        actions.getError({ system_id: "id was not supplied" })
      )
    ).toEqual(
      machineStateFactory({
        errors: { system_id: "id was not supplied" },
        loading: false,
      })
    );
  });

  it("should update if machine exists on getSuccess", () => {
    const initialState = machineStateFactory({
      items: [machineFactory({ system_id: "abc123", hostname: "machine1" })],
      loading: false,
      statuses: {
        abc123: machineStatusFactory(),
      },
    });
    const updatedMachine = machineDetailsFactory({
      system_id: "abc123",
      hostname: "machine1-newname",
    });

    expect(reducers(initialState, actions.getSuccess(updatedMachine))).toEqual(
      machineStateFactory({
        items: [updatedMachine],
        loading: false,
        statuses: {
          abc123: machineStatusFactory(),
        },
      })
    );
  });

  it("reduces getSuccess", () => {
    const initialState = machineStateFactory({
      items: [machineFactory({ system_id: "abc123" })],
      loading: true,
      statuses: {
        abc123: machineStatusFactory(),
      },
    });
    const newMachine = machineDetailsFactory({ system_id: "def456" });

    expect(reducers(initialState, actions.getSuccess(newMachine))).toEqual(
      machineStateFactory({
        items: [...initialState.items, newMachine],
        loading: false,
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("reduces setActiveSuccess", () => {
    const initialState = machineStateFactory({ active: null });

    expect(
      reducers(
        initialState,
        actions.setActiveSuccess(machineDetailsFactory({ system_id: "abc123" }))
      )
    ).toEqual(machineStateFactory({ active: "abc123" }));
  });

  it("reduces setActiveError", () => {
    const initialState = machineStateFactory({
      active: "abc123",
      errors: null,
    });

    expect(
      reducers(initialState, actions.setActiveError("Machine does not exist"))
    ).toEqual(
      machineStateFactory({ active: null, errors: "Machine does not exist" })
    );
  });

  it("reduces createStart", () => {
    const initialState = machineStateFactory({ saved: true, saving: false });

    expect(reducers(initialState, actions.createStart())).toEqual(
      machineStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces createError", () => {
    const initialState = machineStateFactory({
      errors: null,
      saved: false,
      saving: true,
    });

    expect(
      reducers(
        initialState,
        actions.createError({ name: "name already exists" })
      )
    ).toEqual(
      machineStateFactory({
        errors: { name: "name already exists" },
        saved: false,
        saving: false,
      })
    );
  });

  it("should update if machine exists on createNotify", () => {
    const initialState = machineStateFactory({
      items: [
        machineFactory({ id: 1, hostname: "machine1", system_id: "abc123" }),
      ],
      statuses: { abc123: machineStatusFactory() },
    });
    const updatedMachine = machineFactory({
      id: 1,
      hostname: "machine1-newname",
      system_id: "abc123",
    });

    expect(
      reducers(initialState, actions.createNotify(updatedMachine))
    ).toEqual(
      machineStateFactory({
        items: [updatedMachine],
        statuses: {
          abc123: machineStatusFactory(),
        },
      })
    );
  });

  it("reduces createNotify", () => {
    const initialState = machineStateFactory({
      items: [machineFactory({ id: 1, system_id: "abc123" })],
      statuses: { abc123: machineStatusFactory() },
    });
    const newMachine = machineFactory({ id: 2, system_id: "def456" });

    expect(reducers(initialState, actions.createNotify(newMachine))).toEqual(
      machineStateFactory({
        items: [...initialState.items, newMachine],
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("reduces deleteNotify", () => {
    const initialState = machineStateFactory({
      items: [
        machineFactory({ system_id: "abc123" }),
        machineFactory({ system_id: "def456" }),
      ],
      selected: ["abc123"],
      statuses: {
        abc123: machineStatusFactory(),
        def456: machineStatusFactory(),
      },
    });

    expect(reducers(initialState, actions.deleteNotify("abc123"))).toEqual(
      machineStateFactory({
        items: [initialState.items[1]],
        selected: [],
        statuses: { def456: machineStatusFactory() },
      })
    );
  });

  it("reduces updateNotify", () => {
    const initialState = machineStateFactory({
      items: [
        machineFactory({ id: 1, system_id: "abc123", hostname: "node1" }),
        machineFactory({ id: 2, system_id: "def456", hostname: "node2" }),
      ],
    });
    const updatedMachine = machineFactory({
      id: 1,
      system_id: "abc123",
      hostname: "node1v2",
    });

    expect(
      reducers(initialState, actions.updateNotify(updatedMachine))
    ).toEqual(
      machineStateFactory({
        items: [updatedMachine, initialState.items[1]],
      })
    );
  });

  it("reduces checkPowerError", () => {
    const machines = [
      machineFactory({ id: 1, system_id: "abc123", hostname: "node1" }),
    ];
    const initialState = machineStateFactory({
      items: machines,
      statuses: { abc123: machineStatusFactory({ checkingPower: true }) },
    });

    expect(
      reducers(
        initialState,
        actions.checkPowerError({
          item: machines[0],
          payload: "Uh oh!",
        })
      )
    ).toEqual(
      machineStateFactory({
        errors: "Uh oh!",
        items: machines,
        statuses: { abc123: machineStatusFactory({ checkingPower: false }) },
      })
    );
  });

  it("reduces setSelected", () => {
    const initialState = machineStateFactory({ selected: [] });

    expect(
      reducers(initialState, actions.setSelected(["abcde", "fghij"]))
    ).toEqual(
      machineStateFactory({
        selected: ["abcde", "fghij"],
      })
    );
  });

  describe("setPool", () => {
    it("reduces setPoolStart", () => {
      const machines = [
        machineFactory({ id: 1, system_id: "abc123", hostname: "node1" }),
      ];
      const initialState = machineStateFactory({
        items: machines,
        statuses: { abc123: machineStatusFactory({ settingPool: false }) },
      });

      expect(
        reducers(
          initialState,
          actions.setPoolStart({
            item: machines[0],
          })
        )
      ).toEqual(
        machineStateFactory({
          items: machines,
          statuses: {
            abc123: machineStatusFactory({
              settingPool: true,
            }),
          },
        })
      );
    });

    it("reduces setPoolSuccess", () => {
      const machines = [
        machineFactory({ id: 1, system_id: "abc123", hostname: "node1" }),
      ];
      const initialState = machineStateFactory({
        items: machines,
        statuses: { abc123: machineStatusFactory({ settingPool: true }) },
      });

      expect(
        reducers(
          initialState,
          actions.setPoolSuccess({
            item: machines[0],
          })
        )
      ).toEqual(
        machineStateFactory({
          items: machines,
          statuses: {
            abc123: machineStatusFactory({
              settingPool: false,
            }),
          },
        })
      );
    });

    it("reduces setPoolError", () => {
      const machines = [
        machineFactory({ id: 1, system_id: "abc123", hostname: "node1" }),
      ];
      const initialState = machineStateFactory({
        errors: null,
        items: machines,
        statuses: { abc123: machineStatusFactory({ settingPool: true }) },
      });

      expect(
        reducers(
          initialState,
          actions.setPoolError({
            item: machines[0],
            payload: "Uh oh",
          })
        )
      ).toEqual(
        machineStateFactory({
          errors: "Uh oh",
          items: machines,
          statuses: {
            abc123: machineStatusFactory({
              settingPool: false,
            }),
          },
        })
      );
    });
  });

  it("reduces updateStart", () => {
    const initialState = machineStateFactory({ saved: true, saving: false });

    expect(reducers(initialState, actions.updateStart())).toEqual(
      machineStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces createError", () => {
    const initialState = machineStateFactory({
      errors: {},
      saving: true,
    });

    expect(reducers(initialState, actions.createError("Uh oh"))).toEqual(
      machineStateFactory({
        errors: "Uh oh",
        saving: false,
      })
    );
  });
});
