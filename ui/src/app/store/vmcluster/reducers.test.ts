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
      eventErrors: [],
      items: [],
      statuses: {
        listingByPhysicalCluster: false,
      },
    });
  });

  it("reduces fetchStart", () => {
    expect(
      reducers(
        vmClusterStateFactory({
          statuses: vmClusterStatusesFactory({
            listingByPhysicalCluster: false,
          }),
        }),
        actions.listByPhysicalClusterStart()
      )
    ).toEqual(
      vmClusterStateFactory({
        statuses: vmClusterStatusesFactory({
          listingByPhysicalCluster: true,
        }),
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const items = [[vmClusterFactory()]];
    expect(
      reducers(
        vmClusterStateFactory({
          statuses: vmClusterStatusesFactory({
            listingByPhysicalCluster: true,
          }),
        }),
        actions.listByPhysicalClusterSuccess(items)
      )
    ).toEqual(
      vmClusterStateFactory({
        items,
        statuses: vmClusterStatusesFactory({
          listingByPhysicalCluster: false,
        }),
      })
    );
  });

  it("reduces fetchError", () => {
    expect(
      reducers(
        vmClusterStateFactory({
          statuses: vmClusterStatusesFactory({
            listingByPhysicalCluster: true,
          }),
        }),
        actions.listByPhysicalClusterError("Could not fetch ")
      )
    ).toEqual(
      vmClusterStateFactory({
        eventErrors: [
          vmClusterEventErrorFactory({
            error: "Could not fetch ",
            event: "listByPhysicalCluster",
          }),
        ],
        statuses: vmClusterStatusesFactory({
          listingByPhysicalCluster: false,
        }),
      })
    );
  });
});
