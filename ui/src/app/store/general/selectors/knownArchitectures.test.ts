import knownArchitectures from "./knownArchitectures";

import {
  generalState as generalStateFactory,
  knownArchitecture as knownArchitectureFactory,
  knownArchitecturesState as knownArchitecturesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("knownArchitectures selectors", () => {
  describe("get", () => {
    it("returns knownArchitectures", () => {
      const data = [knownArchitectureFactory(), knownArchitectureFactory()];
      const state = rootStateFactory({
        general: generalStateFactory({
          knownArchitectures: knownArchitecturesStateFactory({
            data,
          }),
        }),
      });
      expect(knownArchitectures.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns knownArchitectures loading state", () => {
      const state = rootStateFactory({
        general: generalStateFactory({
          knownArchitectures: knownArchitecturesStateFactory({
            loading: true,
          }),
        }),
      });
      expect(knownArchitectures.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns knownArchitectures loaded state", () => {
      const state = rootStateFactory({
        general: generalStateFactory({
          knownArchitectures: knownArchitecturesStateFactory({
            loaded: true,
          }),
        }),
      });
      expect(knownArchitectures.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns knownArchitectures errors state", () => {
      const errors = "Cannot fetch known architectures.";
      const state = rootStateFactory({
        general: generalStateFactory({
          knownArchitectures: knownArchitecturesStateFactory({
            errors,
          }),
        }),
      });
      expect(knownArchitectures.errors(state)).toStrictEqual(errors);
    });
  });
});
