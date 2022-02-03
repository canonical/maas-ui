import ipRange from "./selectors";

import {
  rootState as rootStateFactory,
  ipRange as ipRangeFactory,
  ipRangeState as ipRangeStateFactory,
} from "testing/factories";

describe("all", () => {
  it("returns list of all IP ranges", () => {
    const items = [ipRangeFactory(), ipRangeFactory()];
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        items,
      }),
    });
    expect(ipRange.all(state)).toStrictEqual(items);
  });
});

describe("loading", () => {
  it("returns iprange loading state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        loading: false,
      }),
    });
    expect(ipRange.loading(state)).toStrictEqual(false);
  });
});

describe("loaded", () => {
  it("returns iprange loaded state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        loaded: true,
      }),
    });
    expect(ipRange.loaded(state)).toStrictEqual(true);
  });
});

describe("errors", () => {
  it("returns iprange error state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        errors: "Unable to list IP ranges.",
      }),
    });
    expect(ipRange.errors(state)).toEqual("Unable to list IP ranges.");
  });
});

describe("saving", () => {
  it("returns iprange saving state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        saving: true,
      }),
    });
    expect(ipRange.saving(state)).toStrictEqual(true);
  });
});

describe("saved", () => {
  it("returns iprange saved state", () => {
    const state = rootStateFactory({
      iprange: ipRangeStateFactory({
        saved: true,
      }),
    });
    expect(ipRange.saved(state)).toStrictEqual(true);
  });
});
