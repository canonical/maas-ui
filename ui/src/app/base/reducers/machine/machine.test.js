import machine from "./machine";

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(machine(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce FETCH_MACHINE_START", () => {
    expect(
      machine(undefined, {
        type: "FETCH_MACHINE_START",
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce FETCH_MACHINE_SUCCESS", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          type: "FETCH_MACHINE_SUCCESS",
          payload: [
            { id: 1, hostname: "node1" },
            { id: 2, hostname: "node2" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, hostname: "node1" },
        { id: 2, hostname: "node2" },
      ],
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should update existing items on FETCH_MACHINE_SUCCESS", () => {
    expect(
      machine(
        {
          errors: {},
          items: [{ id: 1, hostname: "node1" }],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          type: "FETCH_MACHINE_SUCCESS",
          payload: [
            { id: 1, hostname: "node1" },
            { id: 2, hostname: "node2" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, hostname: "node1" },
        { id: 2, hostname: "node2" },
      ],
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce FETCH_MACHINE_ERROR", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          error: "Could not fetch machines",
          type: "FETCH_MACHINE_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not fetch machines",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce CREATE_MACHINE_START", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
          selected: [],
        },
        {
          type: "CREATE_MACHINE_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
      selected: [],
    });
  });

  it("should correctly reduce CREATE_MACHINE_ERROR", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
          selected: [],
        },
        {
          error: { name: "name already exists" },
          type: "CREATE_MACHINE_ERROR",
        }
      )
    ).toEqual({
      errors: { name: "name already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce CREATE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [{ id: 1, name: "machine1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          payload: { id: 2, name: "machine2" },
          type: "CREATE_MACHINE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "machine1" },
        { id: 2, name: "machine2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce DELETE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [
            { id: 1, system_id: "abc" },
            { id: 2, system_id: "def" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: ["abc"],
        },
        {
          payload: "abc",
          type: "DELETE_MACHINE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 2, system_id: "def" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce UPDATE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [
            { id: 1, hostname: "node1" },
            { id: 2, hostname: "node2" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          payload: {
            id: 1,
            hostname: "node1v2",
          },
          type: "UPDATE_MACHINE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, hostname: "node1v2" },
        { id: 2, hostname: "node2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce CHECK_MACHINE_POWER_ERROR", () => {
    expect(
      machine(
        {
          errors: null,
          items: [],
          loaded: false,
          loading: true,
          selected: [],
        },
        {
          type: "CHECK_MACHINE_POWER_ERROR",
          error: "Uh oh!",
        }
      )
    ).toEqual({
      errors: "Uh oh!",
      loading: true,
      loaded: false,
      items: [],
      selected: [],
    });
  });

  it("should correctly reduce SET_SELECTED_MACHINES", () => {
    expect(
      machine(
        {
          errors: {},
          items: [
            { system_id: "abcde", hostname: "node1" },
            { system_id: "fghij", hostname: "node2" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          payload: ["abcde", "fghij"],
          type: "SET_SELECTED_MACHINES",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { system_id: "abcde", hostname: "node1" },
        { system_id: "fghij", hostname: "node2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: ["abcde", "fghij"],
    });
  });
});
