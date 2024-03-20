import reducers, { actions } from "./slice";
import { BootResourceAction } from "./types";

import * as factory from "@/testing/factories";

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
          factory.bootResourceState({
            statuses: factory.bootResourceStatuses({
              deletingImage: false,
            }),
          }),
          actions.deleteImageStart()
        )
      ).toEqual(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            deletingImage: true,
          }),
        })
      );
    });

    it("reduces deleteImageSuccess", () => {
      expect(
        reducers(
          factory.bootResourceState({
            statuses: factory.bootResourceStatuses({
              deletingImage: true,
            }),
          }),
          actions.deleteImageSuccess()
        )
      ).toEqual(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            deletingImage: false,
          }),
        })
      );
    });

    it("reduces deleteImageError", () => {
      expect(
        reducers(
          factory.bootResourceState({
            statuses: factory.bootResourceStatuses({
              deletingImage: true,
            }),
          }),
          actions.deleteImageError("Could not delete image")
        )
      ).toEqual(
        factory.bootResourceState({
          eventErrors: [
            factory.bootResourceEventError({
              error: "Could not delete image",
              event: BootResourceAction.DELETE_IMAGE,
            }),
          ],
          statuses: factory.bootResourceStatuses({
            deletingImage: false,
          }),
        })
      );
    });

    it("reduces fetchStart", () => {
      expect(
        reducers(
          factory.bootResourceState({
            statuses: factory.bootResourceStatuses({
              fetching: false,
            }),
          }),
          actions.fetchStart()
        )
      ).toEqual(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            fetching: true,
          }),
        })
      );
    });

    it("reduces fetchSuccess", () => {
      const fetchedImages = factory.bootResourceFetchedImages({
        arches: [factory.bootResourceFetchedArch()],
        releases: [factory.bootResourceFetchedRelease()],
      });
      expect(
        reducers(
          factory.bootResourceState({
            statuses: factory.bootResourceStatuses({
              fetching: true,
            }),
          }),
          actions.fetchSuccess(fetchedImages)
        )
      ).toEqual(
        factory.bootResourceState({
          fetchedImages,
          statuses: factory.bootResourceStatuses({
            fetching: false,
          }),
        })
      );
    });

    it("reduces fetchError", () => {
      expect(
        reducers(
          factory.bootResourceState({
            statuses: factory.bootResourceStatuses({
              fetching: true,
            }),
          }),
          actions.fetchError("Could not fetch images")
        )
      ).toEqual(
        factory.bootResourceState({
          eventErrors: [
            factory.bootResourceEventError({
              error: "Could not fetch images",
              event: BootResourceAction.FETCH,
            }),
          ],
          statuses: factory.bootResourceStatuses({
            fetching: false,
          }),
        })
      );
    });

    it("reduces pollStart", () => {
      expect(
        reducers(
          factory.bootResourceState({
            statuses: factory.bootResourceStatuses({
              polling: false,
            }),
          }),
          actions.pollStart()
        )
      ).toEqual(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            polling: true,
          }),
        })
      );
    });

    it("reduces pollSuccess", () => {
      const bootResourceState = factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          polling: true,
        }),
      });
      const resources = [factory.bootResource()];
      const ubuntu = factory.bootResourceUbuntu();
      const ubuntuCoreImages = [factory.bootResourceUbuntuCoreImage()];
      const otherImages = [factory.bootResourceOtherImage()];
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
        factory.bootResourceState({
          connectionError: false,
          otherImages,
          rackImportRunning: false,
          regionImportRunning: false,
          resources,
          ubuntuCoreImages,
          ubuntu,
          statuses: factory.bootResourceStatuses({
            polling: false,
          }),
        })
      );
    });

    it("reduces pollError", () => {
      const bootResourceState = factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          polling: true,
        }),
      });
      expect(
        reducers(bootResourceState, actions.pollError("Could not poll"))
      ).toEqual(
        factory.bootResourceState({
          eventErrors: [
            factory.bootResourceEventError({
              error: "Could not poll",
              event: BootResourceAction.POLL,
            }),
          ],
          statuses: factory.bootResourceStatuses({
            polling: false,
          }),
        })
      );
    });
  });

  it("reduces saveOtherStart", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingOther: false,
          }),
        }),
        actions.saveOtherStart()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingOther: true,
        }),
      })
    );
  });

  it("reduces saveOtherSuccess", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingOther: true,
          }),
        }),
        actions.saveOtherSuccess()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingOther: false,
        }),
      })
    );
  });

  it("reduces saveOtherError", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingOther: true,
          }),
        }),
        actions.saveOtherError("Could not save other images")
      )
    ).toEqual(
      factory.bootResourceState({
        eventErrors: [
          factory.bootResourceEventError({
            error: "Could not save other images",
            event: BootResourceAction.SAVE_OTHER,
          }),
        ],
        statuses: factory.bootResourceStatuses({
          savingOther: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuStart", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingUbuntu: false,
          }),
        }),
        actions.saveUbuntuStart()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingUbuntu: true,
        }),
      })
    );
  });

  it("reduces saveUbuntuSuccess", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingUbuntu: true,
          }),
        }),
        actions.saveUbuntuSuccess()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingUbuntu: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuError", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingUbuntu: true,
          }),
        }),
        actions.saveUbuntuError("Could not save Ubuntu images")
      )
    ).toEqual(
      factory.bootResourceState({
        eventErrors: [
          factory.bootResourceEventError({
            error: "Could not save Ubuntu images",
            event: BootResourceAction.SAVE_UBUNTU,
          }),
        ],
        statuses: factory.bootResourceStatuses({
          savingUbuntu: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuCoreStart", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingUbuntuCore: false,
          }),
        }),
        actions.saveUbuntuCoreStart()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingUbuntuCore: true,
        }),
      })
    );
  });

  it("reduces saveUbuntuCoreSuccess", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingUbuntuCore: true,
          }),
        }),
        actions.saveUbuntuCoreSuccess()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingUbuntuCore: false,
        }),
      })
    );
  });

  it("reduces saveUbuntuCoreError", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            savingUbuntuCore: true,
          }),
        }),
        actions.saveUbuntuCoreError("Could not save Ubuntu core images")
      )
    ).toEqual(
      factory.bootResourceState({
        eventErrors: [
          factory.bootResourceEventError({
            error: "Could not save Ubuntu core images",
            event: BootResourceAction.SAVE_UBUNTU_CORE,
          }),
        ],
        statuses: factory.bootResourceStatuses({
          savingUbuntuCore: false,
        }),
      })
    );
  });

  it("reduces stopImportStart", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            stoppingImport: false,
          }),
        }),
        actions.stopImportStart()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          stoppingImport: true,
        }),
      })
    );
  });

  it("reduces stopImportSuccess", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            stoppingImport: true,
          }),
        }),
        actions.stopImportSuccess()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          stoppingImport: false,
        }),
      })
    );
  });

  it("reduces stopImportError", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            stoppingImport: true,
          }),
        }),
        actions.stopImportError("Could not stop importing images")
      )
    ).toEqual(
      factory.bootResourceState({
        eventErrors: [
          factory.bootResourceEventError({
            error: "Could not stop importing images",
            event: BootResourceAction.STOP_IMPORT,
          }),
        ],
        statuses: factory.bootResourceStatuses({
          stoppingImport: false,
        }),
      })
    );
  });

  it("reduces pollStop", () => {
    expect(
      reducers(
        factory.bootResourceState({
          statuses: factory.bootResourceStatuses({
            polling: true,
          }),
        }),
        actions.pollStop()
      )
    ).toEqual(
      factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          polling: false,
        }),
      })
    );
  });

  it("reduces clearFetchedImages", () => {
    expect(
      reducers(
        factory.bootResourceState({
          fetchedImages: factory.bootResourceFetchedImages(),
        }),
        actions.clearFetchedImages()
      )
    ).toEqual(
      factory.bootResourceState({
        fetchedImages: null,
      })
    );
  });
});
