import machine from "./machine";

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(machine(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_MACHINE_START", () => {
    expect(
      machine(undefined, {
        type: "FETCH_MACHINE_START"
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false
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
          saving: false
        },
        {
          type: "FETCH_MACHINE_SUCCESS",
          payload: [
            { id: 1, hostname: "node1" },
            { id: 2, hostname: "node2" }
          ]
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, hostname: "node1" },
        { id: 2, hostname: "node2" }
      ],
      loading: false,
      loaded: true,
      saved: false,
      saving: false
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
          saving: false
        },
        {
          error: "Could not fetch machines",
          type: "FETCH_MACHINE_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not fetch machines",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
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
          saving: false
        },
        {
          type: "CREATE_MACHINE_START"
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true
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
          saving: true
        },
        {
          error: { name: "name already exists" },
          type: "CREATE_MACHINE_ERROR"
        }
      )
    ).toEqual({
      errors: { name: "name already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
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
          saving: false
        },
        {
          payload: { id: 2, name: "machine2" },
          type: "CREATE_MACHINE_NOTIFY"
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "machine1" },
        { id: 2, name: "machine2" }
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce UPDATE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [
            { id: 1, hostname: "node1" },
            { id: 2, hostname: "node2" }
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: {
            id: 1,
            hostname: "node1v2"
          },
          type: "UPDATE_MACHINE_NOTIFY"
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, hostname: "node1v2" },
        { id: 2, hostname: "node2" }
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CHECK_MACHINE_POWER_ERROR", () => {
    expect(
      machine(
        {
          errors: null,
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "CHECK_MACHINE_POWER_ERROR",
          error: "Uh oh!"
        }
      )
    ).toEqual({
      errors: "Uh oh!",
      loading: true,
      loaded: false,
      items: []
    });
  });
});
