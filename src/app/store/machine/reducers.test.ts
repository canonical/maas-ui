import reducers, { actions } from "./slice";
import { FilterGroupKey, FilterGroupType } from "./types";

import { NodeActions } from "app/store/types/node";
import {
  filterGroup as filterGroupFactory,
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineEventError as machineEventErrorFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  machineState as machineStateFactory,
  machineStateCount as machineStateCountFactory,
  machineStateDetailsItem as machineStateDetailsItemFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      actions: {},
      active: null,
      errors: null,
      counts: {},
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
      selectedMachines: null,
      statuses: {},
    });
  });

  it("reduces countStart", () => {
    const initialState = machineStateFactory({ loading: false });
    expect(reducers(initialState, actions.countStart("123456"))).toEqual(
      machineStateFactory({
        counts: {
          "123456": machineStateCountFactory({
            loading: true,
          }),
        },
      })
    );
  });

  it("reduces countSuccess", () => {
    const initialState = machineStateFactory({
      counts: {
        "123456": machineStateCountFactory({
          loaded: true,
          loading: true,
        }),
      },
    });
    expect(
      reducers(
        initialState,
        actions.countSuccess("123456", {
          count: 11,
        })
      )
    ).toEqual(
      machineStateFactory({
        counts: {
          "123456": machineStateCountFactory({
            count: 11,
            loaded: true,
            loading: false,
          }),
        },
      })
    );
  });

  it("reduces invalidateQueries", () => {
    const initialState = machineStateFactory({
      loading: false,
      counts: {
        "1234": machineStateCountFactory({
          loaded: true,
          stale: false,
        }),
      },
      lists: {
        "5678": machineStateListFactory({
          loaded: true,
          stale: false,
        }),
      },
    });
    expect(reducers(initialState, actions.invalidateQueries())).toEqual(
      machineStateFactory({
        counts: {
          "1234": machineStateCountFactory({
            loaded: true,
            stale: true,
          }),
        },
        lists: {
          "5678": machineStateListFactory({
            loaded: true,
            stale: true,
          }),
        },
      })
    );
  });

  it("marks count requests as stale on delete notify", () => {
    const initialState = machineStateFactory({
      loading: false,
      counts: {
        "1234": machineStateCountFactory({
          loaded: true,
          stale: false,
        }),
      },
    });
    expect(reducers(initialState, actions.deleteNotify("abc123"))).toEqual(
      machineStateFactory({
        counts: {
          "1234": machineStateCountFactory({
            loaded: true,
            stale: true,
          }),
        },
      })
    );
  });

  it("updates selected machines on delete notify", () => {
    const initialState = machineStateFactory({
      selectedMachines: { items: ["abc123"] },
    });
    expect(reducers(initialState, actions.deleteNotify("abc123"))).toEqual(
      machineStateFactory({
        selectedMachines: { items: [] },
      })
    );
  });

  it("ignores calls that don't exist when reducing countSuccess", () => {
    const initialState = machineStateFactory({
      counts: {},
    });
    expect(
      reducers(
        initialState,
        actions.countSuccess("123456", {
          count: 11,
        })
      )
    ).toEqual(
      machineStateFactory({
        counts: {},
      })
    );
  });

  it("reduces countError", () => {
    const initialState = machineStateFactory({
      counts: {
        "123456": machineStateCountFactory({
          loading: true,
        }),
      },
    });
    expect(
      reducers(
        initialState,
        actions.countError("123456", "Could not count machines")
      )
    ).toEqual(
      machineStateFactory({
        counts: {
          "123456": machineStateCountFactory({
            errors: "Could not count machines",
            loading: false,
          }),
        },
        eventErrors: [
          machineEventErrorFactory({
            error: "Could not count machines",
            event: "count",
            id: null,
          }),
        ],
      })
    );
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
          loaded: false,
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
              value: "admin1",
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
                value: "admin1",
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

  it("reduces machine action with filter", () => {
    const initialState = machineStateFactory();

    expect(
      reducers(
        initialState,
        actions.delete({ filter: { id: "abc123" }, callId: "123456" })
      )
    ).toEqual(initialState);
  });

  it("ignores calls that don't exist when reducing fetchSuccess", () => {
    const initialState = machineStateFactory({
      items: [],
      lists: {},
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
              value: "admin1",
            },
          ],
          num_pages: 3,
        })
      )
    ).toEqual(
      machineStateFactory({
        items: [],
        lists: {},
        statuses: {},
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
      lists: {
        "123456": machineStateListFactory(),
      },
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
              value: "admin1",
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
                value: "admin1",
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

  it("reduces filterOptionsStart", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Owner,
          loading: false,
        }),
      ],
    });
    expect(
      reducers(initialState, actions.filterOptionsStart(FilterGroupKey.Owner))
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.Owner,
            loading: true,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsError", () => {
    const initialState = machineStateFactory({
      eventErrors: [],
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Owner,
          loading: true,
        }),
      ],
    });
    expect(
      reducers(
        initialState,
        actions.filterOptionsError(
          FilterGroupKey.Owner,
          "Could not fetch filter groups"
        )
      )
    ).toEqual(
      machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            error: "Could not fetch filter groups",
            event: "filterOptions",
            id: undefined,
          }),
        ],
        filters: [
          filterGroupFactory({
            errors: "Could not fetch filter groups",
            key: FilterGroupKey.Owner,
            loading: false,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for bool options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.AgentName,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.Bool,
        }),
      ],
    });
    const fetchedOptions = [
      { key: true, label: "On" },
      { key: false, label: "Off" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.AgentName, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.AgentName,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.Bool,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for float options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Mem,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.Float,
        }),
      ],
    });
    const fetchedOptions = [
      { key: 1024.1, label: "1024.1" },
      { key: 1024.2, label: "2024.2" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.Mem, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.Mem,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.Float,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for lists of float options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Mem,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.FloatList,
        }),
      ],
    });
    const fetchedOptions = [
      { key: 1024.1, label: "1024.1" },
      { key: 1024.2, label: "2024.2" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.Mem, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.Mem,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.FloatList,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for int options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Status,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.Int,
        }),
      ],
    });
    const fetchedOptions = [
      { key: 1, label: "New" },
      { key: 2, label: "Ready" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.Status, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.Status,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.Int,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for lists of int options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Status,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.IntList,
        }),
      ],
    });
    const fetchedOptions = [
      { key: 1, label: "New" },
      { key: 2, label: "Ready" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.Status, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.Status,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.IntList,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for string options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Tags,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.String,
        }),
      ],
    });
    const fetchedOptions = [
      { key: "tag1", label: "Tag 1" },
      { key: "tag2", label: "Tag 2" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.Tags, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.Tags,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.String,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for dict options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.AgentName,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.Dict,
        }),
      ],
    });
    const fetchedOptions = [
      { key: "iface:name=eth0", label: "name=eth0" },
      { key: "iface:name=eth1", label: "name=eth1" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.AgentName, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.AgentName,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.Dict,
          }),
        ],
      })
    );
  });

  it("reduces filterOptionsSuccess for lists of string options", () => {
    const initialState = machineStateFactory({
      filters: [
        filterGroupFactory({
          key: FilterGroupKey.Owner,
          options: null,
          loaded: false,
          loading: true,
          type: FilterGroupType.StringList,
        }),
      ],
    });
    const fetchedOptions = [
      { key: "admin", label: "Admin" },
      { key: "admin2", label: "Admin2" },
    ];
    expect(
      reducers(
        initialState,
        actions.filterOptionsSuccess(FilterGroupKey.Owner, fetchedOptions)
      )
    ).toEqual(
      machineStateFactory({
        filters: [
          filterGroupFactory({
            key: FilterGroupKey.Owner,
            options: fetchedOptions,
            loaded: true,
            loading: false,
            type: FilterGroupType.StringList,
          }),
        ],
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

  it("ignores calls that don't exist when reducing getSuccess", () => {
    const initialState = machineStateFactory({
      details: {},
      items: [],
      statuses: {},
    });
    const newMachine = machineDetailsFactory({ system_id: "def456" });

    expect(
      reducers(
        initialState,
        actions.getSuccess({ system_id: "abc123" }, "123456", newMachine)
      )
    ).toEqual(
      machineStateFactory({
        details: {},
        items: [],
        statuses: {},
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

  it("reduces setSelectedMachines", () => {
    const initialState = machineStateFactory({ selected: [] });

    expect(
      reducers(
        initialState,
        actions.setSelectedMachines({ items: ["abcde", "fghij"] })
      )
    ).toEqual(
      machineStateFactory({
        selectedMachines: { items: ["abcde", "fghij"] },
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

  it("reduces unsubscribeStart for removed statuses", () => {
    const items = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];
    expect(
      reducers(
        machineStateFactory({
          items,
          statuses: {
            def456: machineStatusFactory(),
          },
        }),
        actions.unsubscribeStart(["abc123"])
      )
    ).toEqual(
      machineStateFactory({
        items,
        statuses: {
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

  it("reduces removeRequest for a details request", () => {
    const initialState = machineStateFactory({
      details: {
        123456: machineStateDetailsItemFactory(),
      },
    });
    expect(reducers(initialState, actions.removeRequest("123456"))).toEqual(
      machineStateFactory({
        details: {},
      })
    );
  });

  it("reduces removeRequest for a list request", () => {
    const initialState = machineStateFactory({
      lists: {
        123456: machineStateListFactory(),
      },
    });
    expect(reducers(initialState, actions.removeRequest("123456"))).toEqual(
      machineStateFactory({
        lists: {},
      })
    );
  });

  it("reduces removeRequest for a count request", () => {
    const initialState = machineStateFactory({
      counts: {
        123456: machineStateCountFactory(),
      },
    });
    expect(reducers(initialState, actions.removeRequest("123456"))).toEqual(
      machineStateFactory({
        counts: {},
      })
    );
  });
});
