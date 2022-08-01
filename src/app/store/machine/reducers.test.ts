import reducers, { actions } from "./slice";

import { NodeActions } from "app/store/types/node";
import {
  filterGroup as filterGroupFactory,
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineEventError as machineEventErrorFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  machineState as machineStateFactory,
  machineStateDetailsItem as machineStateDetailsItemFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      active: null,
      errors: null,
      details: {},
      eventErrors: [],
      filters: [],
      filtersLoaded: false,
      filtersLoading: false,
      items: [],
      lists: {},
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

    expect(reducers(initialState, actions.fetchStart("123456"))).toEqual(
      machineStateFactory({
        lists: {
          "123456": machineStateListFactory({
            loading: true,
          }),
        },
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const initialState = machineStateFactory({
      items: [],
      lists: {
        "123456": machineStateListFactory({
          loaded: true,
          loading: true,
        }),
      },
      statuses: {},
    });
    const fetchedMachines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];

    expect(
      reducers(
        initialState,
        actions.fetchSuccess("123456", {
          count: 1,
          cur_page: 2,
          groups: [
            {
              collapsed: true,
              count: 4,
              items: fetchedMachines,
              name: "admin",
            },
          ],
          num_pages: 3,
        })
      )
    ).toEqual(
      machineStateFactory({
        items: fetchedMachines,
        lists: {
          "123456": machineStateListFactory({
            count: 1,
            cur_page: 2,
            groups: [
              machineStateListGroupFactory({
                collapsed: true,
                count: 4,
                items: ["abc123", "def456"],
                name: "admin",
              }),
            ],
            num_pages: 3,
            loaded: true,
            loading: false,
          }),
        },
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("does not update existing items when reducing fetchSuccess", () => {
    const existingMachine = machineDetailsFactory({
      id: 1,
      system_id: "abc123",
    });
    const initialState = machineStateFactory({
      items: [existingMachine],
      statuses: {
        abc123: machineStatusFactory(),
      },
    });
    const fetchedMachines = [
      machineFactory({ id: 1, system_id: "abc123" }),
      machineFactory({ id: 2, system_id: "def456" }),
    ];

    expect(
      reducers(
        initialState,
        actions.fetchSuccess("123456", {
          count: 1,
          cur_page: 2,
          groups: [
            {
              collapsed: true,
              count: 4,
              items: fetchedMachines,
              name: "admin",
            },
          ],
          num_pages: 3,
        })
      )
    ).toEqual(
      machineStateFactory({
        items: [existingMachine, fetchedMachines[1]],
        lists: {
          "123456": machineStateListFactory({
            count: 1,
            cur_page: 2,
            groups: [
              machineStateListGroupFactory({
                collapsed: true,
                count: 4,
                items: ["abc123", "def456"],
                name: "admin",
              }),
            ],
            num_pages: 3,
            loaded: true,
            loading: false,
          }),
        },
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("reduces fetchError", () => {
    const initialState = machineStateFactory({
      lists: {
        "123456": machineStateListFactory({
          loading: true,
        }),
      },
    });

    expect(
      reducers(
        initialState,
        actions.fetchError("123456", "Could not fetch machines")
      )
    ).toEqual(
      machineStateFactory({
        lists: {
          "123456": machineStateListFactory({
            errors: "Could not fetch machines",
            loading: false,
          }),
        },
        eventErrors: [
          machineEventErrorFactory({
            error: "Could not fetch machines",
            event: "fetch",
            id: null,
          }),
        ],
      })
    );
  });

  it("reduces filterGroupsStart", () => {
    const initialState = machineStateFactory({ filtersLoading: false });

    expect(reducers(initialState, actions.filterGroupsStart())).toEqual(
      machineStateFactory({
        filtersLoading: true,
      })
    );
  });

  it("reduces filterGroupsSuccess", () => {
    const initialState = machineStateFactory({
      filters: [],
      filtersLoaded: false,
      filtersLoading: true,
    });
    const filterGroup = filterGroupFactory();
    const fetchedGroups = [filterGroup];

    expect(
      reducers(initialState, actions.filterGroupsSuccess(fetchedGroups))
    ).toEqual(
      machineStateFactory({
        filters: fetchedGroups,
        filtersLoaded: true,
        filtersLoading: false,
      })
    );
  });

  it("reduces filterGroupsError", () => {
    const initialState = machineStateFactory({
      eventErrors: [],
      filtersLoading: true,
    });

    expect(
      reducers(
        initialState,
        actions.filterGroupsError("Could not fetch filter groups")
      )
    ).toEqual(
      machineStateFactory({
        errors: "Could not fetch filter groups",
        eventErrors: [
          machineEventErrorFactory({
            error: "Could not fetch filter groups",
            event: "filterGroups",
            id: null,
          }),
        ],
        filtersLoading: false,
      })
    );
  });

  it("reduces getStart", () => {
    const initialState = machineStateFactory({ loading: false });

    expect(
      reducers(
        initialState,
        actions.getStart({ system_id: "abc123" }, "123456")
      )
    ).toEqual(
      machineStateFactory({
        details: {
          123456: machineStateDetailsItemFactory({
            loading: true,
            system_id: "abc123",
          }),
        },
      })
    );
  });

  it("reduces getError", () => {
    const initialState = machineStateFactory({
      details: {
        123456: machineStateDetailsItemFactory({
          system_id: "abc123",
        }),
      },
      errors: null,
    });

    expect(
      reducers(
        initialState,
        actions.getError({ system_id: "abc123" }, "123456", {
          system_id: "id was not supplied",
        })
      )
    ).toEqual(
      machineStateFactory({
        details: {
          123456: machineStateDetailsItemFactory({
            errors: { system_id: "id was not supplied" },
            system_id: "abc123",
          }),
        },
        errors: null,
        eventErrors: [
          machineEventErrorFactory({
            error: { system_id: "id was not supplied" },
            event: "get",
            id: "abc123",
          }),
        ],
      })
    );
  });

  it("should update if machine exists on getSuccess", () => {
    const initialState = machineStateFactory({
      details: {
        123456: machineStateDetailsItemFactory({
          loading: true,
          system_id: "abc123",
        }),
      },
      items: [machineFactory({ system_id: "abc123", hostname: "machine1" })],
      statuses: {
        abc123: machineStatusFactory(),
      },
    });
    const updatedMachine = machineDetailsFactory({
      system_id: "abc123",
      hostname: "machine1-newname",
    });

    expect(
      reducers(
        initialState,
        actions.getSuccess({ system_id: "abc123" }, "123456", updatedMachine)
      )
    ).toEqual(
      machineStateFactory({
        details: {
          123456: machineStateDetailsItemFactory({
            loaded: true,
            loading: false,
            system_id: "abc123",
          }),
        },
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
      details: {
        123456: machineStateDetailsItemFactory({
          loading: true,
          system_id: "abc123",
        }),
      },
      items: [machineFactory({ system_id: "abc123" })],
      statuses: {
        abc123: machineStatusFactory(),
      },
    });
    const newMachine = machineDetailsFactory({ system_id: "def456" });

    expect(
      reducers(
        initialState,
        actions.getSuccess({ system_id: "abc123" }, "123456", newMachine)
      )
    ).toEqual(
      machineStateFactory({
        details: {
          123456: machineStateDetailsItemFactory({
            loaded: true,
            loading: false,
            system_id: "abc123",
          }),
        },
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
      machineStateFactory({
        active: null,
        errors: "Machine does not exist",
        eventErrors: [
          machineEventErrorFactory({
            error: "Machine does not exist",
            event: "setActive",
            id: null,
          }),
        ],
      })
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
        eventErrors: [
          machineEventErrorFactory({
            error: { name: "name already exists" },
            event: "create",
            id: null,
          }),
        ],
        saved: false,
        saving: false,
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
        eventErrors: [
          machineEventErrorFactory({
            error: "Uh oh!",
            event: "checkPower",
            id: "abc123",
          }),
        ],
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
          eventErrors: [
            machineEventErrorFactory({
              error: "Uh oh",
              event: "setPool",
              id: "abc123",
            }),
          ],
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

  describe("clone", () => {
    it("reduces cloneStart", () => {
      const machine = machineFactory({ system_id: "abc123" });
      const initialState = machineStateFactory({
        items: [machine],
        statuses: { abc123: machineStatusFactory({ cloning: false }) },
      });

      expect(
        reducers(
          initialState,
          actions.cloneStart({
            item: machine,
          })
        )
      ).toEqual(
        machineStateFactory({
          items: [machine],
          statuses: {
            abc123: machineStatusFactory({
              cloning: true,
            }),
          },
        })
      );
    });

    it("reduces cloneSuccess", () => {
      const machine = machineFactory({ system_id: "abc123" });
      const initialState = machineStateFactory({
        items: [machine],
        statuses: { abc123: machineStatusFactory({ cloning: true }) },
      });

      expect(
        reducers(
          initialState,
          actions.cloneSuccess({
            item: machine,
          })
        )
      ).toEqual(
        machineStateFactory({
          items: [machine],
          statuses: {
            abc123: machineStatusFactory({
              cloning: false,
            }),
          },
        })
      );
    });

    it("reduces cloneError", () => {
      const machine = machineFactory({ system_id: "abc123" });
      const initialState = machineStateFactory({
        items: [machine],
        statuses: { abc123: machineStatusFactory({ cloning: true }) },
      });

      expect(
        reducers(
          initialState,
          actions.cloneError({
            item: machine,
            payload: "Cloning failed.",
          })
        )
      ).toEqual(
        machineStateFactory({
          errors: "Cloning failed.",
          eventErrors: [
            machineEventErrorFactory({
              error: "Cloning failed.",
              event: NodeActions.CLONE,
              id: "abc123",
            }),
          ],
          items: [machine],
          statuses: {
            abc123: machineStatusFactory({
              cloning: false,
            }),
          },
        })
      );
    });
  });

  describe("untag", () => {
    it("reduces untagStart", () => {
      const machine = machineFactory({ system_id: "abc123" });
      const initialState = machineStateFactory({
        items: [machine],
        statuses: { abc123: machineStatusFactory({ untagging: false }) },
      });

      expect(
        reducers(
          initialState,
          actions.untagStart({
            item: machine,
          })
        )
      ).toEqual(
        machineStateFactory({
          items: [machine],
          statuses: {
            abc123: machineStatusFactory({
              untagging: true,
            }),
          },
        })
      );
    });

    it("reduces untagSuccess", () => {
      const machine = machineFactory({ system_id: "abc123" });
      const initialState = machineStateFactory({
        items: [machine],
        statuses: { abc123: machineStatusFactory({ untagging: true }) },
      });

      expect(
        reducers(
          initialState,
          actions.untagSuccess({
            item: machine,
          })
        )
      ).toEqual(
        machineStateFactory({
          items: [machine],
          statuses: {
            abc123: machineStatusFactory({
              untagging: false,
            }),
          },
        })
      );
    });

    it("reduces untagError", () => {
      const machine = machineFactory({ system_id: "abc123" });
      const initialState = machineStateFactory({
        items: [machine],
        statuses: { abc123: machineStatusFactory({ untagging: true }) },
      });

      expect(
        reducers(
          initialState,
          actions.untagError({
            item: machine,
            payload: "Untagging failed.",
          })
        )
      ).toEqual(
        machineStateFactory({
          errors: "Untagging failed.",
          eventErrors: [
            machineEventErrorFactory({
              error: "Untagging failed.",
              event: NodeActions.UNTAG,
              id: "abc123",
            }),
          ],
          items: [machine],
          statuses: {
            abc123: machineStatusFactory({
              untagging: false,
            }),
          },
        })
      );
    });
  });

  it("reduces unsubscribeStart", () => {
    const items = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];
    expect(
      reducers(
        machineStateFactory({
          items,
          statuses: {
            abc123: machineStatusFactory(),
            def456: machineStatusFactory(),
          },
        }),
        actions.unsubscribeStart(["abc123"])
      )
    ).toEqual(
      machineStateFactory({
        items,
        statuses: {
          abc123: machineStatusFactory({ unsubscribing: true }),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("reduces unsubscribeSuccess", () => {
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
    expect(
      reducers(initialState, actions.unsubscribeSuccess(["abc123"]))
    ).toEqual(
      machineStateFactory({
        items: [initialState.items[1]],
        selected: [],
        statuses: { def456: machineStatusFactory() },
      })
    );
  });
});
