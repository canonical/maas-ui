import { getCoreIndices, resourceWithOverCommit } from "./utils";

import {
  pod as podFactory,
  podNuma as podNumaFactory,
  podNumaCores as podNumaCoresFactory,
  podResource as podResourceFactory,
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

  describe("resourceWithOverCommit", () => {
    it("handles resources without any over-commit", () => {
      const overCommit = 1;
      const resource = podResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      });
      expect(resourceWithOverCommit(resource, overCommit)).toStrictEqual({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      });
    });

    it("handles resources that are under-committed", () => {
      const overCommit = 0.5;
      const resource = podResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      });
      // Original total = 1 + 2 + 3 = 6
      // Under-committed total = 6 * 0.5 = 3
      expect(resourceWithOverCommit(resource, overCommit)).toStrictEqual({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 0, // Under-commited free = 3 - 2 - 1 = 0
      });
    });

    it("handles resources that are over-committed", () => {
      const overCommit = 2;
      const resource = podResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      });
      // Original total = 1 + 2 + 3 = 6
      // Over-committed total = 6 * 2 = 12
      expect(resourceWithOverCommit(resource, overCommit)).toStrictEqual({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 9, // Over-commited free = 12 - 2 - 1 = 9
      });
    });
  });
});
