import pod, { DEFAULT_STATUSES } from "./pod";

describe("pod reducer", () => {
  it("should return the initial state", () => {
    expect(pod(undefined, { type: "" })).toEqual({
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

  it("should correctly reduce FETCH_POD_START", () => {
    expect(
      pod(undefined, {
        type: "FETCH_POD_START",
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

  it("should correctly reduce FETCH_POD_SUCCESS", () => {
    expect(
      pod(
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
          type: "FETCH_POD_SUCCESS",
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

  it("should correctly reduce FETCH_POD_ERROR", () => {
    expect(
      pod(
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
          type: "FETCH_POD_ERROR",
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

  it("should correctly reduce CREATE_POD_START", () => {
    expect(
      pod(
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
          type: "CREATE_POD_START",
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

  it("should correctly reduce CREATE_POD_ERROR", () => {
    expect(
      pod(
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
          type: "CREATE_POD_ERROR",
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

  it("should correctly reduce CREATE_POD_NOTIFY", () => {
    expect(
      pod(
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
          type: "CREATE_POD_NOTIFY",
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

  it("should correctly reduce DELETE_POD_START", () => {
    expect(
      pod(
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
          type: "DELETE_POD_START",
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

  it("should correctly reduce DELETE_POD_SUCCESS", () => {
    expect(
      pod(
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
          type: "DELETE_POD_SUCCESS",
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

  it("should correctly reduce DELETE_POD_ERROR", () => {
    expect(
      pod(
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
          type: "DELETE_POD_ERROR",
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

  it("should correctly reduce DELETE_POD_NOTIFY", () => {
    expect(
      pod(
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
          type: "DELETE_POD_NOTIFY",
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

  it("should correctly reduce REFRESH_POD_START", () => {
    expect(
      pod(
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
          type: "REFRESH_POD_START",
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

  it("should correctly reduce REFRESH_POD_SUCCESS", () => {
    expect(
      pod(
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
          type: "REFRESH_POD_SUCCESS",
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

  it("should correctly reduce REFRESH_POD_ERROR", () => {
    expect(
      pod(
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
          type: "REFRESH_POD_ERROR",
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

  it("should correctly reduce SET_SELECTED_PODS", () => {
    expect(
      pod(
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
          type: "SET_SELECTED_PODS",
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
