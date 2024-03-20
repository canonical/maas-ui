import bootResourceSelectors from "./selectors";
import { BootResourceAction, BootResourceType } from "./types";

import * as factory from "@/testing/factories";

describe("bootresource selectors", () => {
  it("can get all boot resources", () => {
    const resources = [factory.bootResource()];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources,
      }),
    });
    expect(bootResourceSelectors.resources(state)).toStrictEqual(resources);
  });

  it("can get all synced resources", () => {
    const [synced, uploaded, generated] = [
      factory.bootResource({ rtype: BootResourceType.SYNCED }),
      factory.bootResource({ rtype: BootResourceType.UPLOADED }),
      factory.bootResource({ rtype: BootResourceType.GENERATED }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [synced, uploaded, generated],
      }),
    });
    expect(bootResourceSelectors.syncedResources(state)).toStrictEqual([
      synced,
    ]);
  });

  it("can get all uploaded resources", () => {
    const [synced, uploaded, generated] = [
      factory.bootResource({ rtype: BootResourceType.SYNCED }),
      factory.bootResource({ rtype: BootResourceType.UPLOADED }),
      factory.bootResource({ rtype: BootResourceType.GENERATED }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [synced, uploaded, generated],
      }),
    });
    expect(bootResourceSelectors.uploadedResources(state)).toStrictEqual([
      uploaded,
    ]);
  });

  it("can get all generated resources", () => {
    const [synced, uploaded, generated] = [
      factory.bootResource({ rtype: BootResourceType.SYNCED }),
      factory.bootResource({ rtype: BootResourceType.UPLOADED }),
      factory.bootResource({ rtype: BootResourceType.GENERATED }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [synced, uploaded, generated],
      }),
    });
    expect(bootResourceSelectors.generatedResources(state)).toStrictEqual([
      generated,
    ]);
  });

  it("can get all synced ubuntu boot resources", () => {
    const [syncedUbuntu, syncedNonUbuntu, nonSyncedUbuntu] = [
      factory.bootResource({
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
      }),
      factory.bootResource({
        name: "centos/centos70",
        rtype: BootResourceType.SYNCED,
      }),
      factory.bootResource({
        name: "ubuntu/impish",
        rtype: BootResourceType.UPLOADED,
      }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [syncedUbuntu, syncedNonUbuntu, nonSyncedUbuntu],
      }),
    });
    expect(bootResourceSelectors.ubuntuResources(state)).toStrictEqual([
      syncedUbuntu,
    ]);
  });

  it("can get ubuntu image data", () => {
    const ubuntu = factory.bootResourceUbuntu({
      arches: [factory.bootResourceUbuntuArch()],
      releases: [factory.bootResourceUbuntuRelease()],
    });
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu,
      }),
    });
    expect(bootResourceSelectors.ubuntu(state)).toStrictEqual(ubuntu);
  });

  it("can get all synced ubuntu core boot resources", () => {
    const [syncedUbuntuCore, syncedNonUbuntuCore, nonSyncedUbuntuCore] = [
      factory.bootResource({
        name: "ubuntu-core/10",
        rtype: BootResourceType.SYNCED,
      }),
      factory.bootResource({
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
      }),
      factory.bootResource({
        name: "ubuntu-core/11",
        rtype: BootResourceType.UPLOADED,
      }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [syncedUbuntuCore, syncedNonUbuntuCore, nonSyncedUbuntuCore],
      }),
    });
    expect(bootResourceSelectors.ubuntuCoreResources(state)).toStrictEqual([
      syncedUbuntuCore,
    ]);
  });

  it("can get ubuntu core image data", () => {
    const ubuntuCoreImages = [factory.bootResourceUbuntuCoreImage()];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntuCoreImages,
      }),
    });
    expect(bootResourceSelectors.ubuntuCoreImages(state)).toStrictEqual(
      ubuntuCoreImages
    );
  });

  it("can get all synced other boot resources", () => {
    const [syncedOther, syncedNonOther, nonOtherSynced] = [
      factory.bootResource({
        name: "centos/centos70",
        rtype: BootResourceType.SYNCED,
      }),
      factory.bootResource({
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
      }),
      factory.bootResource({
        name: "centos/8",
        rtype: BootResourceType.UPLOADED,
      }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [syncedOther, syncedNonOther, nonOtherSynced],
      }),
    });
    expect(bootResourceSelectors.otherResources(state)).toStrictEqual([
      syncedOther,
    ]);
  });

  it("can get other images data", () => {
    const otherImages = [factory.bootResourceOtherImage()];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        otherImages,
      }),
    });
    expect(bootResourceSelectors.otherImages(state)).toStrictEqual(otherImages);
  });

  it("can get fetched images data", () => {
    const fetchedImages = factory.bootResourceFetchedImages();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        fetchedImages,
      }),
    });
    expect(bootResourceSelectors.fetchedImages(state)).toStrictEqual(
      fetchedImages
    );
  });

  it("can get all statuses", () => {
    const statuses = factory.bootResourceStatuses({
      polling: true,
    });
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses,
      }),
    });
    expect(bootResourceSelectors.statuses(state)).toStrictEqual(statuses);
  });

  it("can get all event errors", () => {
    const eventErrors = [factory.bootResourceEventError()];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        eventErrors,
      }),
    });
    expect(bootResourceSelectors.eventErrors(state)).toStrictEqual(eventErrors);
  });

  it("can get a fetch error, if it exists", () => {
    const eventErrors = [
      factory.bootResourceEventError({
        event: BootResourceAction.FETCH,
        error: "NO FETCH",
      }),
    ];
    const errorState = factory.rootState({
      bootresource: factory.bootResourceState({
        eventErrors,
      }),
    });
    const nonErrorState = factory.rootState({
      bootresource: factory.bootResourceState({
        eventErrors: [],
      }),
    });
    expect(bootResourceSelectors.fetchError(errorState)).toBe("NO FETCH");
    expect(bootResourceSelectors.fetchError(nonErrorState)).toBe(null);
  });

  it("can get the deletingImage status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          deletingImage: true,
        }),
      }),
    });
    expect(bootResourceSelectors.deletingImage(state)).toBe(true);
  });

  it("can get the fetching status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          fetching: true,
        }),
      }),
    });
    expect(bootResourceSelectors.fetching(state)).toBe(true);
  });

  it("can get the polling status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          polling: true,
        }),
      }),
    });
    expect(bootResourceSelectors.polling(state)).toBe(true);
  });

  it("can get the savingOther status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingOther: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingOther(state)).toBe(true);
  });

  it("can get the savingUbuntu status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingUbuntu: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingUbuntu(state)).toBe(true);
  });

  it("can get the savingUbuntuCore status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          savingUbuntuCore: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingUbuntuCore(state)).toBe(true);
  });

  it("can get the stoppingImport status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          stoppingImport: true,
        }),
      }),
    });
    expect(bootResourceSelectors.stoppingImport(state)).toBe(true);
  });

  it("can get the rackImportRunning state", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        rackImportRunning: true,
      }),
    });
    expect(bootResourceSelectors.rackImportRunning(state)).toBe(true);
  });

  it("can get the regionImportRunning state", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        regionImportRunning: true,
      }),
    });
    expect(bootResourceSelectors.regionImportRunning(state)).toBe(true);
  });
});
