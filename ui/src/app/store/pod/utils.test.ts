import { getCoreIndices } from "./utils";

import {
  pod as podFactory,
  podNuma as podNumaFactory,
  podNumaCores as podNumaCoresFactory,
  podResources as podResourcesFactory,
} from "testing/factories";

describe("pod utils", () => {
  describe("getCoreIndices", () => {
    it("handles pods without numa data", () => {
      const pod = podFactory({
        resources: podResourcesFactory({
          numa: [],
        }),
      });
      expect(getCoreIndices(pod, "allocated")).toStrictEqual([]);
    });

    it("can collate the indices of the pod's allocated cores", () => {
      const pod = podFactory({
        resources: podResourcesFactory({
          numa: [
            podNumaFactory({
              cores: podNumaCoresFactory({ allocated: [3] }),
            }),
            podNumaFactory({
              cores: podNumaCoresFactory({ allocated: [1, 5] }),
            }),
          ],
        }),
      });
      expect(getCoreIndices(pod, "allocated")).toStrictEqual([1, 3, 5]);
    });

    it("can collate the indices of the pod's free cores", () => {
      const pod = podFactory({
        resources: podResourcesFactory({
          numa: [
            podNumaFactory({
              cores: podNumaCoresFactory({ free: [0, 4] }),
            }),
            podNumaFactory({
              cores: podNumaCoresFactory({ free: [1, 2] }),
            }),
          ],
        }),
      });
      expect(getCoreIndices(pod, "free")).toStrictEqual([0, 1, 2, 4]);
    });
  });
});
