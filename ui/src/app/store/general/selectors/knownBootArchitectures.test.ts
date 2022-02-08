import knownBootArchitectures from "./knownBootArchitectures";

import {
  generalState as generalStateFactory,
  knownBootArchitecture as knownBootArchitectureFactory,
  knownBootArchitecturesState as knownBootArchitecturesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("get", () => {
  it("returns knownBootArchitectures", () => {
    const data = [
      knownBootArchitectureFactory(),
      knownBootArchitectureFactory(),
    ];
    const state = rootStateFactory({
      general: generalStateFactory({
        knownBootArchitectures: knownBootArchitecturesStateFactory({
          data,
        }),
      }),
    });
    expect(knownBootArchitectures.get(state)).toStrictEqual(data);
  });
});

describe("loading", () => {
  it("returns knownBootArchitectures loading state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        knownBootArchitectures: knownBootArchitecturesStateFactory({
          loading: true,
        }),
      }),
    });
    expect(knownBootArchitectures.loading(state)).toStrictEqual(true);
  });
});

describe("loaded", () => {
  it("returns knownBootArchitectures loaded state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        knownBootArchitectures: knownBootArchitecturesStateFactory({
          loaded: true,
        }),
      }),
    });
    expect(knownBootArchitectures.loaded(state)).toStrictEqual(true);
  });
});

describe("errors", () => {
  it("returns knownBootArchitectures errors state", () => {
    const errors = "Cannot fetch known architectures.";
    const state = rootStateFactory({
      general: generalStateFactory({
        knownBootArchitectures: knownBootArchitecturesStateFactory({
          errors,
        }),
      }),
    });
    expect(knownBootArchitectures.errors(state)).toStrictEqual(errors);
  });
});
