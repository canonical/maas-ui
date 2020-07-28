import {
  pod as podFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
} from "testing/factories";
import reducers, { actions, DEFAULT_STATUSES } from "./slice";

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

  it("should correctly reduce fetch", () => {
    expect(reducers(undefined, actions.fetch())).toEqual({
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

  it("should correctly reduce fetchStart", () => {
    expect(reducers(undefined, actions.fetchStart())).toEqual({
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

  it("should correctly reduce fetchSuccess", () => {
    const pods = [podFactory()];
    const podState = podStateFactory({
      items: [],
      loading: true,
    });
    expect(reducers(podState, actions.fetchSuccess(pods))).toEqual({
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

  it("should correctly reduce fetchError", () => {
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

  it("should correctly reduce getStart", () => {
    const podState = podStateFactory({ items: [], loading: false });

    expect(reducers(podState, actions.getStart())).toEqual(
      podStateFactory({ loading: true })
    );
  });

  it("should correctly reduce getSuccess", () => {
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

  it("should correctly reduce getError", () => {
    const podState = podStateFactory({ loading: true });

    expect(reducers(podState, actions.getError("Could not get pod"))).toEqual(
      podStateFactory({
        errors: "Could not get pod",
        loading: false,
      })
    );
  });

  it("should correctly reduce createStart", () => {
    const podState = podStateFactory({ saved: true });

    expect(reducers(podState, actions.createStart())).toEqual({
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

  it("should correctly reduce createError", () => {
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

  it("should correctly reduce composeStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

    expect(reducers(podState, actions.composeStart({ item: pods[0] }))).toEqual(
      {
        errors: {},
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

  it("should correctly reduce composeSuccess", () => {
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

  it("should correctly reduce composeError", () => {
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

  it("should correctly reduce deleteStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory() },
    });

    expect(reducers(podState, actions.deleteStart({ item: pods[0] }))).toEqual({
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

  it("should correctly reduce deleteSuccess", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });
    expect(
      reducers(podState, actions.deleteSuccess({ item: pods[0] }))
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

  it("should correctly reduce deleteError", () => {
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

  it("should correctly reduce deleteNotify", () => {
    const pods = [podFactory({ id: 1 }), podFactory({ id: 2 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ deleting: true }),
        2: podStatusFactory(),
      },
    });

    expect(reducers(podState, actions.deleteNotify(1))).toEqual({
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

  it("should correctly reduce refreshStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory(),
      },
    });

    expect(reducers(podState, actions.refreshStart({ item: pods[0] }))).toEqual(
      {
        errors: {},
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

  it("should correctly reduce refreshSuccess", () => {
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

  it("should correctly reduce refreshError", () => {
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

  it("should correctly reduce setSelected", () => {
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
