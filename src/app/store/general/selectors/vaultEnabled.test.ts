import vaultEnabled from "./vaultEnabled";

import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  vaultEnabledState as vaultEnabledStateFactory,
} from "testing/factories";

describe("get", () => {
  it("returns vaultEnabled", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          data: false,
        }),
      }),
    });
    expect(vaultEnabled.get(state)).toStrictEqual(false);
  });
});

describe("loading", () => {
  it("returns vaultEnabled loading state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          loading: true,
        }),
      }),
    });
    expect(vaultEnabled.loading(state)).toStrictEqual(true);
  });
});

describe("loaded", () => {
  it("returns vaultEnabled loaded state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          loaded: true,
        }),
      }),
    });
    expect(vaultEnabled.loaded(state)).toStrictEqual(true);
  });
});

describe("errors", () => {
  it("returns vaultEnabled errors state", () => {
    const errors = "Cannot fetch Vault status";
    const state = rootStateFactory({
      general: generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          errors,
        }),
      }),
    });
    expect(vaultEnabled.errors(state)).toStrictEqual(errors);
  });
});
