import reducers, { actions, DEFAULT_STATUSES } from "./index";

describe("pod reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("should correctly reduce FETCH_START", () => {
    expect(
      reducers(undefined, {
        type: actions.fetchStart().type,
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("should correctly reduce FETCH_SUCCESS", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
          selected: [],
          statuses: {},
        },
        {
          type: actions.fetchSuccess().type,
          payload: [
            { id: 1, name: "pod1" },
            { id: 2, name: "pod2" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: DEFAULT_STATUSES, 2: DEFAULT_STATUSES },
      items: [
        { id: 1, name: "pod1" },
        { id: 2, name: "pod2" },
      ],
    });
  });

  it("should correctly reduce FETCH_ERROR", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: {},
        },
        {
          error: "Could not fetch pods",
          type: actions.fetchError().type,
        }
      )
    ).toEqual({
      errors: "Could not fetch pods",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("should correctly reduce CREATE_START", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
          selected: [],
          statuses: {},
        },
        {
          type: actions.createStart().type,
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
      statuses: {},
    });
  });

  it("should correctly reduce CREATE_ERROR", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
          selected: [],
          statuses: {},
        },
        {
          error: { name: "Pod name already exists" },
          type: actions.createError().type,
        }
      )
    ).toEqual({
      errors: { name: "Pod name already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("should correctly reduce CREATE_NOTIFY", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1, name: "pod1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: DEFAULT_STATUSES },
        },
        {
          payload: { id: 2, name: "pod2" },
          type: "CREATE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "pod1" },
        { id: 2, name: "pod2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: DEFAULT_STATUSES, 2: DEFAULT_STATUSES },
    });
  });

  it("should correctly reduce DELETE_START", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1 }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: { deleting: false } },
        },
        {
          meta: {
            item: {
              id: 1,
            },
          },
          type: "DELETE_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1 }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { deleting: true } },
    });
  });

  it("should correctly reduce DELETE_SUCCESS", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1 }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: { deleting: true } },
        },
        {
          meta: {
            item: {
              id: 1,
            },
          },
          type: "DELETE_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1 }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { deleting: false } },
    });
  });

  it("should correctly reduce DELETE_ERROR", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1 }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: { deleting: true } },
        },
        {
          error: "Pod cannot be deleted",
          meta: {
            item: {
              id: 1,
            },
          },
          type: "DELETE_ERROR",
        }
      )
    ).toEqual({
      errors: "Pod cannot be deleted",
      items: [{ id: 1 }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { deleting: false } },
    });
  });

  it("should correctly reduce DELETE_NOTIFY", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1 }, { id: 2 }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: { deleting: false }, 2: { deleting: false } },
        },
        {
          meta: {
            item: {
              id: 1,
            },
          },
          payload: 1,
          type: "DELETE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 2 }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 2: { deleting: false } },
    });
  });

  it("should correctly reduce REFRESH_START", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1 }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: { refreshing: false } },
        },
        {
          meta: {
            item: {
              id: 1,
            },
          },
          type: "REFRESH_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1 }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { refreshing: true } },
    });
  });

  it("should correctly reduce REFRESH_SUCCESS", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1, cpu_speed: 100 }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: { refreshing: true } },
        },
        {
          meta: {
            item: {
              id: 1,
            },
          },
          payload: { id: 1, cpu_speed: 200 },
          type: "REFRESH_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, cpu_speed: 200 }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { refreshing: false } },
    });
  });

  it("should correctly reduce REFRESH_ERROR", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [{ id: 1, cpu_speed: 100 }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { 1: { refreshing: true } },
        },
        {
          error: "You dun goofed",
          meta: {
            item: {
              id: 1,
            },
          },
          type: "REFRESH_ERROR",
        }
      )
    ).toEqual({
      errors: "You dun goofed",
      items: [{ id: 1, cpu_speed: 100 }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { refreshing: false } },
    });
  });

  it("should correctly reduce SET_SELECTED", () => {
    expect(
      reducers(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: {},
        },
        {
          payload: [1, 2, 4],
          type: "SET_SELECTED",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [1, 2, 4],
      statuses: {},
    });
  });
});
