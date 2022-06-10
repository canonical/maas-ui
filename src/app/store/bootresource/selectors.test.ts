import bootResourceSelectors from "./selectors";
import { BootResourceAction, BootResourceType } from "./types";

import {
  bootResource as bootResourceFactory,
  bootResourceEventError as eventErrorFactory,
  bootResourceFetchedImages as bootResourceFetchedImagesFactory,
  bootResourceOtherImage as bootResourceOtherImageFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuCoreImage as bootResourceUbuntuCoreImageFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("bootresource selectors", () => {
  it("can get all boot resources", () => {
    const resources = [bootResourceFactory()];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
      }),
    });
    expect(bootResourceSelectors.resources(state)).toStrictEqual(resources);
  });

  it("can get all synced resources", () => {
    const [synced, uploaded, generated] = [
      bootResourceFactory({ rtype: BootResourceType.SYNCED }),
      bootResourceFactory({ rtype: BootResourceType.UPLOADED }),
      bootResourceFactory({ rtype: BootResourceType.GENERATED }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [synced, uploaded, generated],
      }),
    });
    expect(bootResourceSelectors.syncedResources(state)).toStrictEqual([
      synced,
    ]);
  });

  it("can get all uploaded resources", () => {
    const [synced, uploaded, generated] = [
      bootResourceFactory({ rtype: BootResourceType.SYNCED }),
      bootResourceFactory({ rtype: BootResourceType.UPLOADED }),
      bootResourceFactory({ rtype: BootResourceType.GENERATED }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [synced, uploaded, generated],
      }),
    });
    expect(bootResourceSelectors.uploadedResources(state)).toStrictEqual([
      uploaded,
    ]);
  });

  it("can get all generated resources", () => {
    const [synced, uploaded, generated] = [
      bootResourceFactory({ rtype: BootResourceType.SYNCED }),
      bootResourceFactory({ rtype: BootResourceType.UPLOADED }),
      bootResourceFactory({ rtype: BootResourceType.GENERATED }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [synced, uploaded, generated],
      }),
    });
    expect(bootResourceSelectors.generatedResources(state)).toStrictEqual([
      generated,
    ]);
  });

  it("can get all synced ubuntu boot resources", () => {
    const [syncedUbuntu, syncedNonUbuntu, nonSyncedUbuntu] = [
      bootResourceFactory({
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
      }),
      bootResourceFactory({
        name: "centos/centos70",
        rtype: BootResourceType.SYNCED,
      }),
      bootResourceFactory({
        name: "ubuntu/impish",
        rtype: BootResourceType.UPLOADED,
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [syncedUbuntu, syncedNonUbuntu, nonSyncedUbuntu],
      }),
    });
    expect(bootResourceSelectors.ubuntuResources(state)).toStrictEqual([
      syncedUbuntu,
    ]);
  });

  it("can get ubuntu image data", () => {
    const ubuntu = bootResourceUbuntuFactory({
      arches: [bootResourceUbuntuArchFactory()],
      releases: [bootResourceUbuntuReleaseFactory()],
    });
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu,
      }),
    });
    expect(bootResourceSelectors.ubuntu(state)).toStrictEqual(ubuntu);
  });

  it("can get all synced ubuntu core boot resources", () => {
    const [syncedUbuntuCore, syncedNonUbuntuCore, nonSyncedUbuntuCore] = [
      bootResourceFactory({
        name: "ubuntu-core/10",
        rtype: BootResourceType.SYNCED,
      }),
      bootResourceFactory({
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
      }),
      bootResourceFactory({
        name: "ubuntu-core/11",
        rtype: BootResourceType.UPLOADED,
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [syncedUbuntuCore, syncedNonUbuntuCore, nonSyncedUbuntuCore],
      }),
    });
    expect(bootResourceSelectors.ubuntuCoreResources(state)).toStrictEqual([
      syncedUbuntuCore,
    ]);
  });

  it("can get ubuntu core image data", () => {
    const ubuntuCoreImages = [bootResourceUbuntuCoreImageFactory()];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntuCoreImages,
      }),
    });
    expect(bootResourceSelectors.ubuntuCoreImages(state)).toStrictEqual(
      ubuntuCoreImages
    );
  });

  it("can get all synced other boot resources", () => {
    const [syncedOther, syncedNonOther, nonOtherSynced] = [
      bootResourceFactory({
        name: "centos/centos70",
        rtype: BootResourceType.SYNCED,
      }),
      bootResourceFactory({
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
      }),
      bootResourceFactory({
        name: "centos/8",
        rtype: BootResourceType.UPLOADED,
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [syncedOther, syncedNonOther, nonOtherSynced],
      }),
    });
    expect(bootResourceSelectors.otherResources(state)).toStrictEqual([
      syncedOther,
    ]);
  });

  it("can get other images data", () => {
    const otherImages = [bootResourceOtherImageFactory()];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages,
      }),
    });
    expect(bootResourceSelectors.otherImages(state)).toStrictEqual(otherImages);
  });

  it("can get fetched images data", () => {
    const fetchedImages = bootResourceFetchedImagesFactory();
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        fetchedImages,
      }),
    });
    expect(bootResourceSelectors.fetchedImages(state)).toStrictEqual(
      fetchedImages
    );
  });

  it("can get all statuses", () => {
    const statuses = bootResourceStatusesFactory({
      polling: true,
    });
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses,
      }),
    });
    expect(bootResourceSelectors.statuses(state)).toStrictEqual(statuses);
  });

  it("can get all event errors", () => {
    const eventErrors = [eventErrorFactory()];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        eventErrors,
      }),
    });
    expect(bootResourceSelectors.eventErrors(state)).toStrictEqual(eventErrors);
  });

  it("can get a fetch error, if it exists", () => {
    const eventErrors = [
      eventErrorFactory({
        event: BootResourceAction.FETCH,
        error: "NO FETCH",
      }),
    ];
    const errorState = rootStateFactory({
      bootresource: bootResourceStateFactory({
        eventErrors,
      }),
    });
    const nonErrorState = rootStateFactory({
      bootresource: bootResourceStateFactory({
        eventErrors: [],
      }),
    });
    expect(bootResourceSelectors.fetchError(errorState)).toBe("NO FETCH");
    expect(bootResourceSelectors.fetchError(nonErrorState)).toBe(null);
  });

  it("can get the deletingImage status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          deletingImage: true,
        }),
      }),
    });
    expect(bootResourceSelectors.deletingImage(state)).toBe(true);
  });

  it("can get the fetching status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          fetching: true,
        }),
      }),
    });
    expect(bootResourceSelectors.fetching(state)).toBe(true);
  });

  it("can get the polling status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
        }),
      }),
    });
    expect(bootResourceSelectors.polling(state)).toBe(true);
  });

  it("can get the savingOther status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingOther: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingOther(state)).toBe(true);
  });

  it("can get the savingUbuntu status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntu: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingUbuntu(state)).toBe(true);
  });

  it("can get the savingUbuntuCore status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntuCore: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingUbuntuCore(state)).toBe(true);
  });

  it("can get the stoppingImport status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          stoppingImport: true,
        }),
      }),
    });
    expect(bootResourceSelectors.stoppingImport(state)).toBe(true);
  });

  it("can get the rackImportRunning state", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        rackImportRunning: true,
      }),
    });
    expect(bootResourceSelectors.rackImportRunning(state)).toBe(true);
  });

  it("can get the regionImportRunning state", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        regionImportRunning: true,
      }),
    });
    expect(bootResourceSelectors.regionImportRunning(state)).toBe(true);
  });
});
