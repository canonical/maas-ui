import staticRoute from "./selectors";

import {
  rootState as rootStateFactory,
  staticRoute as staticRouteFactory,
  staticRouteState as staticRouteStateFactory,
} from "testing/factories";

describe("all", () => {
  it("returns list of all static routes", () => {
    const items = [staticRouteFactory(), staticRouteFactory()];
    const state = rootStateFactory({
      staticroute: staticRouteStateFactory({
        items,
      }),
    });
    expect(staticRoute.all(state)).toStrictEqual(items);
  });
});

describe("loading", () => {
  it("returns staticroute loading state", () => {
    const state = rootStateFactory({
      staticroute: staticRouteStateFactory({
        loading: false,
      }),
    });
    expect(staticRoute.loading(state)).toStrictEqual(false);
  });
});

describe("loaded", () => {
  it("returns staticroute loaded state", () => {
    const state = rootStateFactory({
      staticroute: staticRouteStateFactory({
        loaded: true,
      }),
    });
    expect(staticRoute.loaded(state)).toStrictEqual(true);
  });
});

describe("errors", () => {
  it("returns staticroute error state", () => {
    const state = rootStateFactory({
      staticroute: staticRouteStateFactory({
        errors: "Unable to list static routes.",
      }),
    });
    expect(staticRoute.errors(state)).toEqual("Unable to list static routes.");
  });
});

describe("saving", () => {
  it("returns staticroute saving state", () => {
    const state = rootStateFactory({
      staticroute: staticRouteStateFactory({
        saving: true,
      }),
    });
    expect(staticRoute.saving(state)).toStrictEqual(true);
  });
});

describe("saved", () => {
  it("returns staticroute saved state", () => {
    const state = rootStateFactory({
      staticroute: staticRouteStateFactory({
        saved: true,
      }),
    });
    expect(staticRoute.saved(state)).toStrictEqual(true);
  });
});
