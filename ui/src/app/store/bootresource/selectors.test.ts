import bootResourceSelectors from "./selectors";

import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("bootresource selectors", () => {
  it("can get all statuses", () => {
    const statuses = bootResourceStatusesFactory({
      poll: true,
    });
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses,
      }),
    });
    expect(bootResourceSelectors.statuses(state)).toStrictEqual(statuses);
  });

  it("can get the polling status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          poll: true,
        }),
      }),
    });
    expect(bootResourceSelectors.polling(state)).toBe(true);
  });
});
