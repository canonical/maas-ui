import {
  pod as podFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
} from "testing/factories";
import reducers, { actions, DEFAULT_STATUSES } from "./slice";

describe("pod reducer", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("reduces fetch", () => {
    expect(reducers(undefined, actions.fetch())).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("reduces fetchStart", () => {
    expect(reducers(undefined, actions.fetchStart())).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("reduces fetchSuccess", () => {
    const pods = [podFactory()];
    const podState = podStateFactory({
      items: [],
      loading: true,
    });
    expect(reducers(podState, actions.fetchSuccess(pods))).toEqual({
      errors: null,
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: DEFAULT_STATUSES },
      items: pods,
    });
  });

  it("reduces fetchError", () => {
    const podState = podStateFactory();

    expect(
      reducers(podState, actions.fetchError("Could not fetch pods"))
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

  it("reduces getStart", () => {
    const podState = podStateFactory({ items: [], loading: false });

    expect(reducers(podState, actions.getStart())).toEqual(
      podStateFactory({ loading: true })
    );
  });

  it("reduces getSuccess", () => {
    const newPod = podDetailsFactory();
    const podState = podStateFactory({
      items: [],
      loading: true,
    });

    expect(reducers(podState, actions.getSuccess(newPod))).toEqual(
      podStateFactory({
        items: [newPod],
        loading: false,
        statuses: { [newPod.id]: podStatusFactory() },
      })
    );
  });

  it("reduces getError", () => {
    const podState = podStateFactory({ loading: true });

    expect(reducers(podState, actions.getError("Could not get pod"))).toEqual(
      podStateFactory({
        errors: "Could not get pod",
        loading: false,
      })
    );
  });

  it("reduces createStart", () => {
    const podState = podStateFactory({ saved: true });

    expect(reducers(podState, actions.createStart())).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
      selected: [],
      statuses: {},
    });
  });

  it("reduces createError", () => {
    const podState = podStateFactory();

    expect(
      reducers(
        podState,
        actions.createError({ name: "Pod name already exists" })
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

  it("updates pods on createNotify", () => {
    const pods = [podFactory({ id: 1 })];
    const newPod = podFactory({ id: 2 });
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

    expect(reducers(podState, actions.createNotify(newPod))).toEqual({
      errors: null,
      items: [...pods, newPod],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: DEFAULT_STATUSES, 2: DEFAULT_STATUSES },
    });
  });

  it("reduces composeStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

    expect(reducers(podState, actions.composeStart({ item: pods[0] }))).toEqual(
      {
        errors: null,
        items: pods,
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
        selected: [],
        statuses: { 1: podStatusFactory({ composing: true }) },
      }
    );
  });

  it("reduces composeSuccess", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ composing: true }),
      },
    });

    expect(
      reducers(podState, actions.composeSuccess({ item: pods[0] }))
    ).toEqual({
      errors: null,
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ composing: false }) },
    });
  });

  it("reduces composeError", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ composing: true }),
      },
    });

    expect(
      reducers(
        podState,
        actions.composeError({ item: pods[0], payload: "You dun goofed" })
      )
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

  it("reduces deleteStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory() },
    });

    expect(reducers(podState, actions.deleteStart({ item: pods[0] }))).toEqual({
      errors: null,
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });
  });

  it("reduces deleteSuccess", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });
    expect(
      reducers(podState, actions.deleteSuccess({ item: pods[0] }))
    ).toEqual({
      errors: null,
      items: pods,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ deleting: false }) },
    });
  });

  it("reduces deleteError", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });

    expect(
      reducers(
        podState,
        actions.deleteError({ item: pods[0], payload: "Pod cannot be deleted" })
      )
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

  it("reduces deleteNotify", () => {
    const pods = [podFactory({ id: 1 }), podFactory({ id: 2 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ deleting: true }),
        2: podStatusFactory(),
      },
    });

    expect(reducers(podState, actions.deleteNotify(1))).toEqual({
      errors: null,
      items: [pods[1]],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 2: DEFAULT_STATUSES },
    });
  });

  it("reduces refreshStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

    expect(reducers(podState, actions.refreshStart({ item: pods[0] }))).toEqual(
      {
        errors: null,
        items: pods,
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
        selected: [],
        statuses: { 1: podStatusFactory({ refreshing: true }) },
      }
    );
  });

  it("reduces refreshSuccess", () => {
    const pods = [podFactory({ id: 1, cpu_speed: 100 })];
    const updatedPod = podFactory({ id: 1, cpu_speed: 100 });
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ refreshing: true }),
      },
    });

    expect(
      reducers(
        podState,
        actions.refreshSuccess({ item: pods[0], payload: updatedPod })
      )
    ).toEqual({
      errors: null,
      items: [updatedPod],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: { 1: podStatusFactory({ refreshing: false }) },
    });
  });

  it("reduces refreshError", () => {
    const pods = [podFactory({ id: 1, cpu_speed: 100 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ refreshing: true }),
      },
    });

    expect(
      reducers(
        podState,
        actions.refreshError({ item: pods[0], payload: "You dun goofed" })
      )
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

  it("reduces setSelected", () => {
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

    expect(reducers(podState, actions.setSelected([1, 2]))).toEqual({
      errors: null,
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
