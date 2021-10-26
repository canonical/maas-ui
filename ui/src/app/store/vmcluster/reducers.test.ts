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
        deleting: false,
        getting: false,
      },
    });
  });

  describe("fetch", () => {
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

  describe("get", () => {
    it("reduces getStart", () => {
      expect(
        reducers(
          vmClusterStateFactory({
            statuses: vmClusterStatusesFactory({
              getting: false,
            }),
          }),
          actions.getStart()
        )
      ).toEqual(
        vmClusterStateFactory({
          statuses: vmClusterStatusesFactory({
            getting: true,
          }),
        })
      );
    });

    it("reduces getSuccess", () => {
      const cluster = vmClusterFactory();
      expect(
        reducers(
          vmClusterStateFactory({
            items: [],
            statuses: vmClusterStatusesFactory({
              getting: true,
            }),
          }),
          actions.getSuccess(cluster)
        )
      ).toEqual(
        vmClusterStateFactory({
          items: [cluster],
          statuses: vmClusterStatusesFactory({
            getting: false,
          }),
        })
      );
    });

    it("reduces getError", () => {
      expect(
        reducers(
          vmClusterStateFactory({
            statuses: vmClusterStatusesFactory({
              getting: true,
            }),
          }),
          actions.getError("Could not get")
        )
      ).toEqual(
        vmClusterStateFactory({
          eventErrors: [
            vmClusterEventErrorFactory({
              error: "Could not get",
              event: "get",
            }),
          ],
          errors: "Could not get",
          statuses: vmClusterStatusesFactory({
            getting: false,
          }),
        })
      );
    });
  });

  it("reduces deleteStart", () => {
    const vmclusters = [vmClusterFactory({ id: 1 })];
    const state = vmClusterStateFactory({
      items: vmclusters,
      statuses: vmClusterStatusesFactory({ deleting: false }),
    });

    expect(reducers(state, actions.deleteStart())).toEqual(
      vmClusterStateFactory({
        items: vmclusters,
        statuses: vmClusterStatusesFactory({ deleting: true }),
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const vmclusters = [vmClusterFactory({ id: 1 })];
    const state = vmClusterStateFactory({
      items: vmclusters,
      statuses: vmClusterStatusesFactory({ deleting: true }),
    });

    expect(reducers(state, actions.deleteSuccess())).toEqual(
      vmClusterStateFactory({
        items: vmclusters,
        statuses: vmClusterStatusesFactory({ deleting: false }),
      })
    );
  });

  it("reduces deleteError", () => {
    const vmclusters = [vmClusterFactory({ id: 1 })];
    const state = vmClusterStateFactory({
      errors: null,
      items: vmclusters,
      statuses: vmClusterStatusesFactory({ deleting: true }),
    });

    expect(
      reducers(state, actions.deleteError("VMCluster cannot be deleted"))
    ).toEqual(
      vmClusterStateFactory({
        errors: "VMCluster cannot be deleted",
        eventErrors: [
          vmClusterEventErrorFactory({
            error: "VMCluster cannot be deleted",
            event: "delete",
          }),
        ],
        items: vmclusters,
        statuses: vmClusterStatusesFactory({ deleting: false }),
      })
    );
  });

  it("reduces deleteNotify", () => {
    const vmclusters = [
      vmClusterFactory({ id: 1 }),
      vmClusterFactory({ id: 2 }),
    ];
    const state = vmClusterStateFactory({
      items: vmclusters,
    });

    expect(reducers(state, actions.deleteNotify(1))).toEqual(
      vmClusterStateFactory({
        items: [vmclusters[1]],
      })
    );
  });
});
