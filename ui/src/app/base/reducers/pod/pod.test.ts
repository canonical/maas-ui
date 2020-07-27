import {
  pod as podFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
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
    const pods = [podFactory()];
    const podState = podStateFactory({
      items: [],
      loading: true,
    });
    expect(
      pod(podState, {
        type: "FETCH_POD_SUCCESS",
        payload: pods,
      })
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: DEFAULT_STATUSES },
      items: pods,
    });
  });

  it("should correctly reduce FETCH_POD_ERROR", () => {
    const podState = podStateFactory();

    expect(
      pod(podState, {
        error: "Could not fetch pods",
        type: "FETCH_POD_ERROR",
      })
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

  it("should correctly reduce GET_POD_START", () => {
    const podState = podStateFactory({ items: [], loading: false });

    expect(
      pod(podState, {
        type: "GET_POD_START",
        params: { id: 1 },
      })
    ).toEqual(podStateFactory({ loading: true }));
  });

  it("should correctly reduce GET_POD_SUCCESS", () => {
    const newPod = podDetailsFactory();
    const podState = podStateFactory({
      items: [],
      loading: true,
    });

    expect(
      pod(podState, {
        type: "GET_POD_SUCCESS",
        payload: newPod,
      })
    ).toEqual(
      podStateFactory({
        items: [newPod],
        loading: false,
        statuses: { [newPod.id]: podStatusFactory() },
      })
    );
  });

  it("should correctly reduce GET_POD_ERROR", () => {
    const podState = podStateFactory({ loading: true });

    expect(
      pod(podState, {
        error: "Could not get pod",
        type: "GET_POD_ERROR",
      })
    ).toEqual(
      podStateFactory({
        errors: "Could not get pod",
        loading: false,
      })
    );
  });

  it("should correctly reduce CREATE_POD_START", () => {
    const podState = podStateFactory({ saved: true });

    expect(
      pod(podState, {
        type: "CREATE_POD_START",
      })
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
    const podState = podStateFactory();

    expect(
      pod(podState, {
        error: { name: "Pod name already exists" },
        type: "CREATE_POD_ERROR",
      })
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

  it("updates pods on CREATE_POD_NOTIFY", () => {
    const pods = [podFactory({ id: 1 })];
    const newPod = podFactory({ id: 2 });
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

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

  it("should correctly reduce COMPOSE_POD_START", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

    expect(
      pod(podState, {
        meta: {
          item: {
            id: 1,
          },
        },
        type: "COMPOSE_POD_START",
      })
    ).toEqual({
      errors: {},
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ composing: true }) },
    });
  });

  it("should correctly reduce COMPOSE_POD_SUCCESS", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ composing: true }),
      },
    });

    expect(
      pod(podState, {
        meta: {
          item: {
            id: 1,
          },
        },
        type: "COMPOSE_POD_SUCCESS",
      })
    ).toEqual({
      errors: {},
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ composing: false }) },
    });
  });

  it("should correctly reduce COMPOSE_POD_ERROR", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ composing: true }),
      },
    });

    expect(
      pod(podState, {
        error: "You dun goofed",
        meta: {
          item: {
            id: 1,
          },
        },
        type: "COMPOSE_POD_ERROR",
      })
    ).toEqual({
      errors: "You dun goofed",
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ composing: false }) },
    });
  });

  it("should correctly reduce DELETE_POD_START", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory() },
    });

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
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });
  });

  it("should correctly reduce DELETE_POD_SUCCESS", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });
    expect(
      pod(podState, {
        meta: {
          item: {
            id: 1,
          },
        },
        type: "DELETE_POD_SUCCESS",
      })
    ).toEqual({
      errors: {},
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ deleting: false }) },
    });
  });

  it("should correctly reduce DELETE_POD_ERROR", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });

    expect(
      pod(podState, {
        error: "Pod cannot be deleted",
        meta: {
          item: {
            id: 1,
          },
        },
        type: "DELETE_POD_ERROR",
      })
    ).toEqual({
      errors: "Pod cannot be deleted",
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ deleting: false }) },
    });
  });

  it("should correctly reduce DELETE_POD_NOTIFY", () => {
    const pods = [podFactory({ id: 1 }), podFactory({ id: 2 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ deleting: true }),
        2: podStatusFactory(),
      },
    });

    expect(
      pod(podState, {
        meta: {
          item: {
            id: 1,
          },
        },
        payload: 1,
        type: "DELETE_POD_NOTIFY",
      })
    ).toEqual({
      errors: {},
      items: [pods[1]],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 2: DEFAULT_STATUSES },
    });
  });

  it("should correctly reduce REFRESH_POD_START", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

    expect(
      pod(podState, {
        meta: {
          item: {
            id: 1,
          },
        },
        type: "REFRESH_POD_START",
      })
    ).toEqual({
      errors: {},
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ refreshing: true }) },
    });
  });

  it("should correctly reduce REFRESH_POD_SUCCESS", () => {
    const pods = [podFactory({ id: 1, cpu_speed: 100 })];
    const updatedPod = podFactory({ id: 1, cpu_speed: 100 });
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ refreshing: true }),
      },
    });

    expect(
      pod(podState, {
        meta: {
          item: {
            id: 1,
          },
        },
        payload: updatedPod,
        type: "REFRESH_POD_SUCCESS",
      })
    ).toEqual({
      errors: {},
      items: [updatedPod],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ refreshing: false }) },
    });
  });

  it("should correctly reduce REFRESH_POD_ERROR", () => {
    const pods = [podFactory({ id: 1, cpu_speed: 100 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ refreshing: true }),
      },
    });

    expect(
      pod(podState, {
        error: "You dun goofed",
        meta: {
          item: {
            id: 1,
          },
        },
        type: "REFRESH_POD_ERROR",
      })
    ).toEqual({
      errors: "You dun goofed",
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ refreshing: false }) },
    });
  });

  it("should correctly reduce SET_SELECTED_PODS", () => {
    const pods = [
      podFactory({ id: 1 }),
      podFactory({ id: 2 }),
      podFactory({ id: 3 }),
    ];
    const podState = podStateFactory({
      items: pods,
      selected: [3],
      statuses: {
        1: podStatusFactory(),
        2: podStatusFactory(),
        3: podStatusFactory(),
      },
    });

    expect(
      pod(podState, {
        payload: [1, 2],
        type: "SET_SELECTED_PODS",
      })
    ).toEqual({
      errors: {},
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [1, 2],
      statuses: {
        1: podStatusFactory(),
        2: podStatusFactory(),
        3: podStatusFactory(),
      },
    });
  });
});
