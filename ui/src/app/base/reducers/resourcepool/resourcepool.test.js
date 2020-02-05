import resourcepool from "./resourcepool";

describe("resourcepool reducer", () => {
  it("should return the initial state", () => {
    expect(resourcepool(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_RESOURCEPOOL_START", () => {
    expect(
      resourcepool(undefined, {
        type: "FETCH_RESOURCEPOOL_START"
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
        is_default: true
      }
    ];
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_RESOURCEPOOL_SUCCESS",
          payload
        }
      )
    ).toEqual({
      errors: {},
      items: payload,
      loading: false,
      loaded: true,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_RESOURCEPOOL_ERROR", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false
        },
        {
          error: "Could not fetch resource pools",
          type: "FETCH_RESOURCEPOOL_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not fetch resource pools",
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce DELETE_RESOURCEPOOL_START", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false
        },
        {
          type: "DELETE_RESOURCEPOOL_START"
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

  it("should correctly reduce DELETE_RESOURCEPOOL_ERROR", () => {
    expect(
      resourcepool(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: "Could not delete",
          type: "DELETE_RESOURCEPOOL_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not delete",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });
});
