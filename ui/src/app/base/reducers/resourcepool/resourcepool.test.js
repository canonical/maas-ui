import resourcepool from "./resourcepool";

describe("resourcepool reducer", () => {
  it("should return the initial state", () => {
    expect(resourcepool(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  // Fetch
  it("should correctly reduce FETCH_RESOURCEPOOL_START", () => {
    expect(
      resourcepool(undefined, {
        type: "FETCH_RESOURCEPOOL_START",
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_RESOURCEPOOL_SUCCESS", () => {
    const payload = [
      {
        id: 0,
        created: "Mon, 16 Sep. 2019 12:20:11",
        updated: "Mon, 16 Sep. 2019 12:20:11",
        name: "default",
        description: "Default pool",
        permissions: ["edit", "delete"],
        machine_total_count: 24,
        machine_ready_count: 1,
        is_default: true,
      },
    ];
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_RESOURCEPOOL_SUCCESS",
          payload,
        }
      )
    ).toEqual({
      errors: {},
      items: payload,
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_RESOURCEPOOL_ERROR", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
        },
        {
          error: "Could not fetch resource pools",
          type: "FETCH_RESOURCEPOOL_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not fetch resource pools",
      items: [],
      loaded: false,
      loading: false,
    });
  });

  // Create
  it("should correctly reduce CREATE_RESOURCEPOOL_START", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "CREATE_RESOURCEPOOL_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce CREATE_RESOURCEPOOL_ERROR", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: { name: "name already exists" },
          type: "CREATE_RESOURCEPOOL_ERROR",
        }
      )
    ).toEqual({
      errors: { name: "name already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_RESOURCEPOOL_NOTIFY", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [{ id: 1, name: "pool1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: { id: 2, name: "pool2" },
          type: "CREATE_RESOURCEPOOL_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "pool1" },
        { id: 2, name: "pool2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  // Update
  it("should correctly reduce UPDATE_RESOURCEPOOL_START", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "UPDATE_RESOURCEPOOL_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce UPDATE_RESOURCEPOOL_SUCCESS", () => {
    expect(
      resourcepool(
        {
          errors: { name: "Name already exists" },
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          type: "UPDATE_RESOURCEPOOL_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: true,
      saving: false,
    });
  });

  it("should correctly reduce UPDATE_RESOURCEPOOL_ERROR", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: "Could not update resource pool",
          type: "UPDATE_RESOURCEPOOL_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not update resource pool",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce UPDATE_RESOURCEPOOL_NOTIFY", () => {
    expect(
      resourcepool(
        {
          auth: {},
          errors: {},
          items: [
            { id: 1, name: "pool1", description: "" },
            { id: 2, name: "pool2", description: "" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: { id: 1, name: "newName", description: "new description" },
          type: "UPDATE_RESOURCEPOOL_NOTIFY",
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [
        { id: 1, name: "newName", description: "new description" },
        { id: 2, name: "pool2", description: "" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  // Delete
  it("should correctly reduce DELETE_RESOURCEPOOL_START", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "DELETE_RESOURCEPOOL_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce DELETE_RESOURCEPOOL_ERROR", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: "Could not delete",
          type: "DELETE_RESOURCEPOOL_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not delete",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  // Cleanup
  it("should correctly reduce CLEANUP_RESOURCEPOOL", () => {
    expect(
      resourcepool(
        {
          errors: { name: "Name already exists" },
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: true,
        },
        {
          type: "CLEANUP_RESOURCEPOOL",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});
