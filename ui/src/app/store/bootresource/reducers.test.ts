import reducers, { actions } from "./slice";
import { BootResourceAction } from "./types";

import {
  bootResource as bootResourceFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuCoreImage as bootResourceUbuntuCoreImageFactory,
  bootResourceOtherImage as bootResourceOtherImageFactory,
  bootResourceEventError as bootResourceEventErrorFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
} from "testing/factories";

describe("bootresource reducers", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      connectionError: false,
      eventErrors: [],
      otherImages: [],
      rackImportRunning: false,
      regionImportRunning: false,
      resources: [],
      statuses: {
        poll: false,
      },
      ubuntu: null,
      ubuntuCoreImages: [],
    });
  });

  describe("poll", () => {
    it("reduces pollStart", () => {
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              poll: false,
            }),
          }),
          actions.pollStart()
        )
      ).toEqual(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            poll: true,
          }),
        })
      );
    });

    it("reduces pollSuccess", () => {
      const bootResourceState = bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          poll: true,
        }),
      });
      const resources = [bootResourceFactory()];
      const ubuntu = bootResourceUbuntuFactory();
      const ubuntuCoreImages = [bootResourceUbuntuCoreImageFactory()];
      const otherImages = [bootResourceOtherImageFactory()];
      expect(
        reducers(
          bootResourceState,
          actions.pollSuccess({
            connection_error: false,
            other_images: otherImages,
            rack_import_running: false,
            region_import_running: false,
            resources,
            ubuntu_core_images: ubuntuCoreImages,
            ubuntu,
          })
        )
      ).toEqual(
        bootResourceStateFactory({
          connectionError: false,
          otherImages,
          rackImportRunning: false,
          regionImportRunning: false,
          resources,
          ubuntuCoreImages,
          ubuntu,
          statuses: bootResourceStatusesFactory({
            poll: false,
          }),
        })
      );
    });

    it("reduces pollError", () => {
      const bootResourceState = bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          poll: true,
        }),
      });
      expect(
        reducers(bootResourceState, actions.pollError("Could not poll"))
      ).toEqual(
        bootResourceStateFactory({
          eventErrors: [
            bootResourceEventErrorFactory({
              error: "Could not poll",
              event: BootResourceAction.POLL,
            }),
          ],
          statuses: bootResourceStatusesFactory({
            poll: false,
          }),
        })
      );
    });
  });
});
