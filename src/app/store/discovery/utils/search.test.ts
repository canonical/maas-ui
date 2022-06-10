import { getDiscoveryValue } from "./search";

import { discovery as discoveryFactory } from "testing/factories";

describe("search", () => {
  describe("getDiscoveryValue", () => {
    it("can get an attribute directly from the discovery", () => {
      const discovery = discoveryFactory({ id: 808 });
      expect(getDiscoveryValue(discovery, "id")).toBe(808);
    });
  });
});
