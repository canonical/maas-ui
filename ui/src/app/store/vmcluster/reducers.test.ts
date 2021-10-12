import reducers, { actions } from "./slice";

import {
  vmCluster as vmClusterFactory,
  vmClusterEventError as vmClusterEventErrorFactory,
  vmClusterState as vmClusterStateFactory,
  vmClusterStatuses as vmClusterStatusesFactory,
} from "testing/factories";

describe("vmCluster reducers", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      eventErrors: [],
      items: [],
      loaded: false,
      loading: false,
      physicalClusters: [],
      saved: false,
      saving: false,
      statuses: {
        getting: false,
      },
    });
  });

  it("reduces fetchStart", () => {
    expect(
      reducers(
        vmClusterStateFactory({
          loading: false,
        }),
        actions.fetchStart()
      )
    ).toEqual(
      vmClusterStateFactory({
        loading: true,
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const items = [vmClusterFactory()];
    expect(
      reducers(
        vmClusterStateFactory({
          loaded: false,
          loading: true,
        }),
        actions.fetchSuccess([items])
      )
    ).toEqual(
      vmClusterStateFactory({
        items,
        loading: false,
        loaded: true,
        physicalClusters: [[items[0].id]],
        statuses: vmClusterStatusesFactory({
          getting: false,
        }),
      })
    );
  });

  it("reduces fetchError", () => {
    expect(
      reducers(
        vmClusterStateFactory({
          loading: true,
        }),
        actions.fetchError("Could not fetch")
      )
    ).toEqual(
      vmClusterStateFactory({
        eventErrors: [
          vmClusterEventErrorFactory({
            error: "Could not fetch",
            event: "fetch",
          }),
        ],
        errors: "Could not fetch",
        loading: false,
      })
    );
  });
});
