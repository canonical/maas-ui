import script from "./selectors";

import { ScriptType } from "app/store/script/types";
import {
  script as scriptFactory,
  scriptState as scriptStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("script selectors", () => {
  describe("all", () => {
    it("returns all script", () => {
      const items = [scriptFactory(), scriptFactory()];
      const state = rootStateFactory({
        script: scriptStateFactory({
          items,
        }),
      });

      expect(script.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns script loading state", () => {
      const state = rootStateFactory({
        script: scriptStateFactory({
          loading: true,
        }),
      });
      expect(script.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns script loaded state", () => {
      const state = rootStateFactory({
        script: scriptStateFactory({
          loaded: true,
        }),
      });
      expect(script.loaded(state)).toStrictEqual(true);
    });
  });

  describe("commissioning", () => {
    it("returns all commissioning script", () => {
      const items = [
        scriptFactory({ script_type: ScriptType.COMMISSIONING }),
        scriptFactory({ script_type: ScriptType.TESTING }),
        scriptFactory({ script_type: ScriptType.COMMISSIONING }),
      ];
      const state = rootStateFactory({
        script: scriptStateFactory({
          items,
        }),
      });

      expect(script.commissioning(state)).toEqual([items[0], items[2]]);
    });
  });

  describe("preselected", () => {
    it("returns all preselected commissioning script", () => {
      const preselectedItems = [
        scriptFactory({ script_type: ScriptType.COMMISSIONING, default: true }),
        scriptFactory({
          script_type: ScriptType.COMMISSIONING,
          default: false,
        }),
      ];
      const nonPreselectedItems = [
        scriptFactory({
          script_type: ScriptType.COMMISSIONING,
          tags: ["noauto"],
        }),
      ];
      const state = rootStateFactory({
        script: scriptStateFactory({
          items: [...preselectedItems, ...nonPreselectedItems],
        }),
      });

      expect(script.preselectedCommissioning(state)).toEqual(preselectedItems);
    });
  });

  describe("testing", () => {
    it("returns all testing script", () => {
      const items = [
        scriptFactory({ script_type: ScriptType.COMMISSIONING }),
        scriptFactory({ script_type: ScriptType.TESTING }),
        scriptFactory({ script_type: ScriptType.TESTING }),
      ];
      const state = rootStateFactory({
        script: scriptStateFactory({
          items,
        }),
      });

      expect(script.testing(state)).toEqual([items[1], items[2]]);
    });
  });

  describe("defaultTesting", () => {
    it("returns all default testing script", () => {
      const items = [
        scriptFactory({ script_type: ScriptType.TESTING, default: true }),
        scriptFactory({ script_type: ScriptType.TESTING, default: false }),
        scriptFactory({ script_type: ScriptType.TESTING, tags: ["noauto"] }),
      ];
      const state = rootStateFactory({
        script: scriptStateFactory({
          items,
        }),
      });

      expect(script.defaultTesting(state)).toEqual([items[0]]);
    });
  });

  describe("testingWithUrl", () => {
    it("returns testing script that contain a url parameter", () => {
      const items = [
        scriptFactory(),
        scriptFactory(),
        scriptFactory({
          parameters: {
            url: {
              default: "www.website.come",
              description: "url description",
            },
          },
          script_type: ScriptType.TESTING,
        }),
      ];
      const state = rootStateFactory({
        script: scriptStateFactory({
          items,
        }),
      });

      expect(script.testingWithUrl(state)).toEqual([items[2]]);
    });
  });
});
