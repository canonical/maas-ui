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
        fetching: false,
      },
    });
  });

  it("reduces fetchStart", () => {
    expect(
      reducers(
        vmClusterStateFactory({
          statuses: vmClusterStatusesFactory({
            fetching: false,
          }),
        }),
        actions.fetchStart()
      )
    ).toEqual(
      vmClusterStateFactory({
        loading: true,
        statuses: vmClusterStatusesFactory({
          fetching: true,
        }),
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const items = [vmClusterFactory()];
    expect(
      reducers(
        vmClusterStateFactory({
          statuses: vmClusterStatusesFactory({
            fetching: true,
          }),
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
          fetching: false,
        }),
      })
    );
  });

  it("reduces fetchError", () => {
    expect(
      reducers(
        vmClusterStateFactory({
          statuses: vmClusterStatusesFactory({
            fetching: true,
          }),
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
        statuses: vmClusterStatusesFactory({
          fetching: false,
        }),
      })
    );
  });
});
