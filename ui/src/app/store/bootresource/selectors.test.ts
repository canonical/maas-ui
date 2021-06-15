import bootResourceSelectors from "./selectors";
import { BootResourceAction } from "./types";

import {
  bootResource as bootResourceFactory,
  bootResourceEventError as eventErrorFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
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

  it("can get all ubuntu boot resources", () => {
    const [ubuntuResource, nonUbuntuResource] = [
      bootResourceFactory({ name: "ubuntu/focal" }),
      bootResourceFactory({ name: "centos/centos70" }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [ubuntuResource, nonUbuntuResource],
      }),
    });
    expect(bootResourceSelectors.ubuntuResources(state)).toStrictEqual([
      ubuntuResource,
    ]);
  });

  it("can get ubuntu boot resource metadata", () => {
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
});
