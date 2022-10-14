import vaultEnabled from "./vaultEnabled";

import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  vaultEnabled as vaultEnabledFactory,
  vaultEnabledState as vaultEnabledStateFactory,
} from "testing/factories";

describe("get", () => {
  it("returns vaultEnabled", () => {
    const data = vaultEnabledFactory();
    const state = rootStateFactory({
      general: generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          data,
        }),
      }),
    });
    expect(vaultEnabled.get(state)).toStrictEqual(data);
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
