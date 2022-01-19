import controller from "./selectors";
import { ImageSyncStatus } from "./types/enum";

import {
  rootState as rootStateFactory,
  controller as controllerFactory,
  controllerImageSyncStatuses as controllerImageSyncStatusesFactory,
  controllerState as controllerStateFactory,
  controllerStatus as controllerStatusFactory,
  controllerStatuses as controllerStatusesFactory,
  service as serviceFactory,
  serviceState as serviceStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

describe("controller selectors", () => {
  it("can get all items", () => {
    const items = [controllerFactory(), controllerFactory()];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items,
      }),
    });
    expect(controller.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      controller: controllerStateFactory({
        loading: true,
      }),
    });
    expect(controller.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
      }),
    });
    expect(controller.loaded(state)).toEqual(true);
  });

  it("can get a controller by id", () => {
    const items = [
      controllerFactory({ system_id: "808" }),
      controllerFactory({ system_id: "909" }),
    ];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items,
      }),
    });
    expect(controller.getById(state, "909")).toStrictEqual(items[1]);
  });

  it("can get the controller statuses", () => {
    const statuses = controllerStatusesFactory();
    const state = rootStateFactory({
      controller: controllerStateFactory({
        statuses,
      }),
    });
    expect(controller.statuses(state)).toStrictEqual(statuses);
  });

  it("can get the statuses for a controller", () => {
    const controllerStatuses = controllerStatusFactory();
    const state = rootStateFactory({
      controller: controllerStateFactory({
        statuses: controllerStatusesFactory({
          abc123: controllerStatuses,
        }),
      }),
    });
    expect(controller.getStatuses(state, "abc123")).toStrictEqual(
      controllerStatuses
    );
  });

  it("can get a status for a controller", () => {
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items: [controllerFactory({ system_id: "abc123" })],
        statuses: controllerStatusesFactory({
          abc123: controllerStatusFactory({ importingImages: true }),
        }),
      }),
    });
    expect(
      controller.getStatusForController(state, "abc123", "importingImages")
    ).toBe(true);
  });

  it("can get controllers that are processing", () => {
    const statuses = controllerStatusesFactory({
      abc123: controllerStatusFactory({ testing: true }),
      def456: controllerStatusFactory(),
    });
    const state = rootStateFactory({
      controller: controllerStateFactory({
        statuses,
      }),
    });
    expect(controller.processing(state)).toStrictEqual(["abc123"]);
  });

  it("can get the image sync state for all controllers", () => {
    const state = rootStateFactory({
      controller: controllerStateFactory({
        imageSyncStatuses: controllerImageSyncStatusesFactory({
          abc123: ImageSyncStatus.OutOfSync,
          def456: ImageSyncStatus.Syncing,
        }),
      }),
    });
    expect(controller.imageSyncStatuses(state)).toStrictEqual(
      controllerImageSyncStatusesFactory({
        abc123: ImageSyncStatus.OutOfSync,
        def456: ImageSyncStatus.Syncing,
      })
    );
  });

  it("can get the image sync state for a controller", () => {
    const state = rootStateFactory({
      controller: controllerStateFactory({
        imageSyncStatuses: controllerImageSyncStatusesFactory({
          abc123: ImageSyncStatus.OutOfSync,
          def456: ImageSyncStatus.Syncing,
        }),
      }),
    });
    expect(controller.imageSyncStatusesForController(state, "abc123")).toBe(
      ImageSyncStatus.OutOfSync
    );
  });

  it("can get the services for a controller", () => {
    const services = [serviceFactory(), serviceFactory()];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items: [
          controllerFactory({
            system_id: "abc123",
            service_ids: services.map(({ id }) => id),
          }),
        ],
      }),
      service: serviceStateFactory({
        items: services,
      }),
    });
    expect(controller.servicesForController(state, "abc123")).toStrictEqual(
      services
    );
  });

  it("can search tags", () => {
    const items = [controllerFactory({ tags: [1] }), controllerFactory()];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items,
      }),
      tag: tagStateFactory({
        items: [tagFactory({ id: 1, name: "echidna" })],
      }),
    });
    expect(controller.search(state, "echidna", [])).toStrictEqual([items[0]]);
  });
});
