import { buildArray } from "testing/factories";
import {
  pod as podFactory,
  podState as podStateFactory,
} from "testing/factories";
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
    const pods = buildArray(podFactory, 2);

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
          payload: pods,
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
      items: pods,
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
    const pods = [podFactory({ id: 1, name: "pod1" })];
    const newPod = podFactory({ id: 2, name: "pod2" });
    const podState = podStateFactory({ items: pods });

    expect(
      pod(podState, {
        payload: newPod,
        type: "CREATE_POD_NOTIFY",
      })
    ).toEqual({
      errors: {},
      items: [...pods, newPod],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: DEFAULT_STATUSES, 2: DEFAULT_STATUSES },
    });
  });

  it("should correctly reduce DELETE_POD_START", () => {
    const podState = podStateFactory({ items: { name: "pod1" } });
    expect(
      pod(podState, {
        meta: {
          item: {
            id: 1,
          },
        },
        type: "DELETE_POD_START",
      })
    ).toEqual({
      errors: {},
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { deleting: true } },
    });
  });

  it("should correctly reduce DELETE_POD_SUCCESS", () => {
    const pods = [podFactory({ id: 1, name: "pod1" })];

    expect(
      pod(
        {
          errors: {},
          items: pods,
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
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { deleting: false } },
    });
  });

  it("should correctly reduce DELETE_POD_ERROR", () => {
    const pods = [podFactory({ id: 1, name: "pod1" })];

    expect(
      pod(
        {
          errors: {},
          items: pods,
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
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { deleting: false } },
    });
  });

  it("should correctly reduce DELETE_POD_NOTIFY", () => {
    const pods = [podFactory({ id: 1 }), podFactory({ id: 2 })];

    expect(
      pod(
        {
          errors: {},
          items: pods,
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
      items: pods[1],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 2: { deleting: false } },
    });
  });

  it("should correctly reduce REFRESH_POD_START", () => {
    const pods = [podFactory({ id: 1, name: "pod1" })];

    expect(
      pod(
        {
          errors: {},
          items: pods,
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
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: { refreshing: true } },
    });
  });

  it("should correctly reduce REFRESH_POD_SUCCESS", () => {
    const pods = [podFactory({ id: 1, cpu_speed: 100 })];
    const updatedPod = podFactory({ id: 1, cpu_speed: 100 });

    expect(
      pod(
        {
          errors: {},
          items: pods,
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
          payload: updatedPod,
          type: "REFRESH_POD_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [updatedPod],
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
