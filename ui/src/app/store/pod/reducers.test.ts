import reducers, { actions } from "./slice";

import {
  pod as podFactory,
  podDetails as podDetailsFactory,
  podProject as podProjectFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
} from "testing/factories";

describe("pod reducer", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      active: null,
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      projects: {},
      saved: false,
      saving: false,
      statuses: {},
    });
  });

  it("reduces fetch", () => {
    const podState = podStateFactory();

    expect(reducers(podState, actions.fetch())).toEqual(podStateFactory());
  });

  it("reduces fetchStart", () => {
    const podState = podStateFactory({ loading: false });

    expect(reducers(podState, actions.fetchStart())).toEqual(
      podStateFactory({
        loading: true,
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const pods = [podFactory()];
    const podState = podStateFactory({
      items: [],
      loaded: false,
      loading: true,
    });
    expect(reducers(podState, actions.fetchSuccess(pods))).toEqual(
      podStateFactory({
        loading: false,
        loaded: true,
        statuses: { 1: podStatusFactory() },
        items: pods,
      })
    );
  });

  it("reduces fetchError", () => {
    const podState = podStateFactory({
      errors: null,
      loaded: false,
      loading: true,
    });

    expect(
      reducers(podState, actions.fetchError("Could not fetch pods"))
    ).toEqual(
      podStateFactory({
        errors: "Could not fetch pods",
        loaded: false,
        loading: false,
      })
    );
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
    const podState = podStateFactory({ saved: true, saving: false });

    expect(reducers(podState, actions.createStart())).toEqual(
      podStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces createError", () => {
    const podState = podStateFactory({ errors: null, saving: true });

    expect(
      reducers(
        podState,
        actions.createError({ name: "Pod name already exists" })
      )
    ).toEqual(
      podStateFactory({
        errors: { name: "Pod name already exists" },
        saving: false,
      })
    );
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

    expect(reducers(podState, actions.createNotify(newPod))).toEqual(
      podStateFactory({
        items: [...pods, newPod],
        statuses: { 1: podStatusFactory(), 2: podStatusFactory() },
      })
    );
  });

  it("reduces composeStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ composing: false }),
      },
    });

    expect(reducers(podState, actions.composeStart({ item: pods[0] }))).toEqual(
      podStateFactory({
        items: pods,
        statuses: { 1: podStatusFactory({ composing: true }) },
      })
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
    ).toEqual(
      podStateFactory({
        items: pods,
        statuses: { 1: podStatusFactory({ composing: false }) },
      })
    );
  });

  it("reduces composeError", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      errors: null,
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
    ).toEqual(
      podStateFactory({
        errors: "You dun goofed",
        items: pods,
        statuses: { 1: podStatusFactory({ composing: false }) },
      })
    );
  });

  it("reduces deleteStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: false }) },
    });

    expect(reducers(podState, actions.deleteStart({ item: pods[0] }))).toEqual(
      podStateFactory({
        items: pods,
        statuses: { 1: podStatusFactory({ deleting: true }) },
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });

    expect(
      reducers(podState, actions.deleteSuccess({ item: pods[0] }))
    ).toEqual(
      podStateFactory({
        items: pods,
        statuses: { 1: podStatusFactory({ deleting: false }) },
      })
    );
  });

  it("reduces deleteError", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      errors: null,
      items: pods,
      statuses: { 1: podStatusFactory({ deleting: true }) },
    });

    expect(
      reducers(
        podState,
        actions.deleteError({ item: pods[0], payload: "Pod cannot be deleted" })
      )
    ).toEqual(
      podStateFactory({
        errors: "Pod cannot be deleted",
        items: pods,
        statuses: { 1: podStatusFactory({ deleting: false }) },
      })
    );
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

    expect(reducers(podState, actions.deleteNotify(1))).toEqual(
      podStateFactory({
        items: [pods[1]],
        statuses: { 2: podStatusFactory() },
      })
    );
  });

  it("reduces refreshStart", () => {
    const pods = [podFactory({ id: 1 })];
    const podState = podStateFactory({
      items: pods,
      statuses: {
        1: podStatusFactory({ refreshing: false }),
      },
    });

    expect(reducers(podState, actions.refreshStart({ item: pods[0] }))).toEqual(
      podStateFactory({
        items: pods,
        statuses: { 1: podStatusFactory({ refreshing: true }) },
      })
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
    ).toEqual(
      podStateFactory({
        items: [updatedPod],
        statuses: { 1: podStatusFactory({ refreshing: false }) },
      })
    );
  });

  it("reduces refreshError", () => {
    const pods = [podFactory({ id: 1, cpu_speed: 100 })];
    const podState = podStateFactory({
      errors: null,
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
    ).toEqual(
      podStateFactory({
        errors: "You dun goofed",
        items: pods,
        statuses: { 1: podStatusFactory({ refreshing: false }) },
      })
    );
  });

  it("reduces setActiveError", () => {
    const podState = podStateFactory({
      active: 1,
      errors: null,
    });

    expect(
      reducers(
        podState,
        actions.setActiveError("Pod with this id does not exist")
      )
    ).toEqual(
      podStateFactory({
        active: null,
        errors: "Pod with this id does not exist",
      })
    );
  });

  it("reduces setActiveSuccess", () => {
    const podState = podStateFactory({
      active: null,
    });

    expect(
      reducers(podState, actions.setActiveSuccess(podFactory({ id: 101 })))
    ).toEqual(
      podStateFactory({
        active: 101,
      })
    );
  });

  it("reduces getProjectsSuccess", () => {
    const serverAddress = "192.168.1.1";
    const newProjects = [podProjectFactory()];
    const podState = podStateFactory({
      items: [],
      projects: {},
    });

    expect(
      reducers(podState, {
        meta: { item: { power_address: serverAddress } },
        ...actions.getProjectsSuccess(newProjects),
      })
    ).toEqual(
      podStateFactory({
        projects: { [serverAddress]: newProjects },
      })
    );
  });

  it("reduces getProjectsError", () => {
    const podState = podStateFactory();

    expect(
      reducers(podState, actions.getProjectsError("Could not get projects"))
    ).toEqual(
      podStateFactory({
        errors: "Could not get projects",
        loading: false,
      })
    );
  });
});
