import reducers, { actions } from "./slice";
import { BootResourceAction } from "./types";

import {
  bootResource as bootResourceFactory,
  bootResourceEventError as bootResourceEventErrorFactory,
  bootResourceFetchedArch as bootResourceFetchedArchFactory,
  bootResourceFetchedImages as bootResourceFetchedImagesFactory,
  bootResourceFetchedRelease as bootResourceFetchedReleaseFactory,
  bootResourceOtherImage as bootResourceOtherImageFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuCoreImage as bootResourceUbuntuCoreImageFactory,
} from "testing/factories";

describe("bootresource reducers", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      connectionError: false,
      eventErrors: [],
      fetchedImages: null,
      otherImages: [],
      rackImportRunning: false,
      regionImportRunning: false,
      resources: [],
      statuses: {
        deletingImage: false,
        fetching: false,
        polling: false,
        savingOther: false,
        savingUbuntuCore: false,
        savingUbuntu: false,
        stoppingImport: false,
      },
      ubuntu: null,
      ubuntuCoreImages: [],
    });
  });

  describe("poll", () => {
    it("reduces deleteImageStart", () => {
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              deletingImage: false,
            }),
          }),
          actions.deleteImageStart()
        )
      ).toEqual(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            deletingImage: true,
          }),
        })
      );
    });

    it("reduces deleteImageSuccess", () => {
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              deletingImage: true,
            }),
          }),
          actions.deleteImageSuccess()
        )
      ).toEqual(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            deletingImage: false,
          }),
        })
      );
    });

    it("reduces deleteImageError", () => {
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              deletingImage: true,
            }),
          }),
          actions.deleteImageError("Could not delete image")
        )
      ).toEqual(
        bootResourceStateFactory({
          eventErrors: [
            bootResourceEventErrorFactory({
              error: "Could not delete image",
              event: BootResourceAction.DELETE_IMAGE,
            }),
          ],
          statuses: bootResourceStatusesFactory({
            deletingImage: false,
          }),
        })
      );
    });

    it("reduces fetchStart", () => {
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              fetching: false,
            }),
          }),
          actions.fetchStart()
        )
      ).toEqual(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            fetching: true,
          }),
        })
      );
    });

    it("reduces fetchSuccess", () => {
      const fetchedImages = bootResourceFetchedImagesFactory({
        arches: [bootResourceFetchedArchFactory()],
        releases: [bootResourceFetchedReleaseFactory()],
      });
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              fetching: true,
            }),
          }),
          actions.fetchSuccess(fetchedImages)
        )
      ).toEqual(
        bootResourceStateFactory({
          fetchedImages,
          statuses: bootResourceStatusesFactory({
            fetching: false,
          }),
        })
      );
    });

    it("reduces fetchError", () => {
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              fetching: true,
            }),
          }),
          actions.fetchError("Could not fetch images")
        )
      ).toEqual(
        bootResourceStateFactory({
          eventErrors: [
            bootResourceEventErrorFactory({
              error: "Could not fetch images",
              event: BootResourceAction.FETCH,
            }),
          ],
          statuses: bootResourceStatusesFactory({
            fetching: false,
          }),
        })
      );
    });

    it("reduces pollStart", () => {
      expect(
        reducers(
          bootResourceStateFactory({
            statuses: bootResourceStatusesFactory({
              polling: false,
            }),
          }),
          actions.pollStart()
        )
      ).toEqual(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            polling: true,
          }),
        })
      );
    });

    it("reduces pollSuccess", () => {
      const bootResourceState = bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
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
            polling: false,
          }),
        })
      );
    });

    it("reduces pollError", () => {
      const bootResourceState = bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
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
            polling: false,
          }),
        })
      );
    });
  });

  it("reduces saveOtherStart", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingOther: false,
          }),
        }),
        actions.saveOtherStart()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingOther: true,
        }),
      })
    );
  });

  it("reduces saveOtherSuccess", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingOther: true,
          }),
        }),
        actions.saveOtherSuccess()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingOther: false,
        }),
      })
    );
  });

  it("reduces saveOtherError", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingOther: true,
          }),
        }),
        actions.saveOtherError("Could not save other images")
      )
    ).toEqual(
      bootResourceStateFactory({
        eventErrors: [
          bootResourceEventErrorFactory({
            error: "Could not save other images",
            event: BootResourceAction.SAVE_OTHER,
          }),
        ],
        statuses: bootResourceStatusesFactory({
          savingOther: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuStart", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingUbuntu: false,
          }),
        }),
        actions.saveUbuntuStart()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntu: true,
        }),
      })
    );
  });

  it("reduces saveUbuntuSuccess", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingUbuntu: true,
          }),
        }),
        actions.saveUbuntuSuccess()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntu: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuError", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingUbuntu: true,
          }),
        }),
        actions.saveUbuntuError("Could not save Ubuntu images")
      )
    ).toEqual(
      bootResourceStateFactory({
        eventErrors: [
          bootResourceEventErrorFactory({
            error: "Could not save Ubuntu images",
            event: BootResourceAction.SAVE_UBUNTU,
          }),
        ],
        statuses: bootResourceStatusesFactory({
          savingUbuntu: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuCoreStart", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingUbuntuCore: false,
          }),
        }),
        actions.saveUbuntuCoreStart()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntuCore: true,
        }),
      })
    );
  });

  it("reduces saveUbuntuCoreSuccess", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingUbuntuCore: true,
          }),
        }),
        actions.saveUbuntuCoreSuccess()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntuCore: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuCoreError", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            savingUbuntuCore: true,
          }),
        }),
        actions.saveUbuntuCoreError("Could not save Ubuntu core images")
      )
    ).toEqual(
      bootResourceStateFactory({
        eventErrors: [
          bootResourceEventErrorFactory({
            error: "Could not save Ubuntu core images",
            event: BootResourceAction.SAVE_UBUNTU_CORE,
          }),
        ],
        statuses: bootResourceStatusesFactory({
          savingUbuntuCore: false,
        }),
      })
    );
  });

  it("reduces stopImportStart", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            stoppingImport: false,
          }),
        }),
        actions.stopImportStart()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          stoppingImport: true,
        }),
      })
    );
  });

  it("reduces stopImportSuccess", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            stoppingImport: true,
          }),
        }),
        actions.stopImportSuccess()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          stoppingImport: false,
        }),
      })
    );
  });

  it("reduces stopImportError", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            stoppingImport: true,
          }),
        }),
        actions.stopImportError("Could not stop importing images")
      )
    ).toEqual(
      bootResourceStateFactory({
        eventErrors: [
          bootResourceEventErrorFactory({
            error: "Could not stop importing images",
            event: BootResourceAction.STOP_IMPORT,
          }),
        ],
        statuses: bootResourceStatusesFactory({
          stoppingImport: false,
        }),
      })
    );
  });

  it("reduces pollStop", () => {
    expect(
      reducers(
        bootResourceStateFactory({
          statuses: bootResourceStatusesFactory({
            polling: true,
          }),
        }),
        actions.pollStop()
      )
    ).toEqual(
      bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: false,
        }),
      })
    );
  });
});
