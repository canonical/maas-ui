import generatedCertificate from "./generatedCertificate";

import {
  generalState as generalStateFactory,
  generatedCertificate as certificateFactory,
  generatedCertificateState as generatedCertificateStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("generatedCertificate selectors", () => {
  describe("get", () => {
    it("returns generatedCertificate", () => {
      const data = certificateFactory();
      const state = rootStateFactory({
        general: generalStateFactory({
          generatedCertificate: generatedCertificateStateFactory({
            data,
          }),
        }),
      });
      expect(generatedCertificate.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns generatedCertificate loading state", () => {
      const loading = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          generatedCertificate: generatedCertificateStateFactory({
            loading,
          }),
        }),
      });
      expect(generatedCertificate.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns generatedCertificate loaded state", () => {
      const loaded = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          generatedCertificate: generatedCertificateStateFactory({
            loaded,
          }),
        }),
      });
      expect(generatedCertificate.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns generatedCertificate errors state", () => {
      const errors = "Cannot fetch generatedCertificate.";
      const state = rootStateFactory({
        general: generalStateFactory({
          generatedCertificate: generatedCertificateStateFactory({
            errors,
          }),
        }),
      });
      expect(generatedCertificate.errors(state)).toStrictEqual(errors);
    });
  });
});
