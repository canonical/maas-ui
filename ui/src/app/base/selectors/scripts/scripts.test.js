import scripts from "./scripts";

describe("scripts selectors", () => {
  describe("all", () => {
    it("returns all scripts", () => {
      const items = [
        {
          name: "commissioning script",
          description: "a commissioning script",
          type: 0,
        },
        {
          name: "testing script",
          description: "a testing script",
          type: 2,
        },
      ];
      const state = {
        scripts: {
          loading: false,
          loaded: true,
          items,
        },
      };

      expect(scripts.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns scripts loading state", () => {
      const state = {
        scripts: {
          loading: true,
          loaded: false,
          items: [],
        },
      };
      expect(scripts.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns scripts loaded state", () => {
      const state = {
        scripts: {
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(scripts.loaded(state)).toStrictEqual(true);
    });
  });

  describe("commissioning", () => {
    it("returns all commissioning scripts", () => {
      const items = [
        {
          name: "commissioning script",
          description: "a commissioning script",
          type: 0,
        },
        {
          name: "testing script",
          description: "a testing script",
          type: 2,
        },
        {
          name: "commissioning script two",
          description: "another commissioning script",
          type: 0,
        },
      ];
      const state = {
        scripts: {
          loading: false,
          loaded: true,
          items,
        },
      };

      expect(scripts.commissioning(state)).toEqual([
        {
          name: "commissioning script",
          description: "a commissioning script",
          type: 0,
        },
        {
          name: "commissioning script two",
          description: "another commissioning script",
          type: 0,
        },
      ]);
    });
  });

  describe("testing", () => {
    it("returns all testing scripts", () => {
      const items = [
        {
          name: "commissioning script",
          description: "a commissioning script",
          type: 0,
        },
        {
          name: "testing script",
          description: "a testing script",
          type: 2,
        },
        {
          name: "testing script two",
          description: "another testing script",
          type: 2,
        },
      ];
      const state = {
        scripts: {
          loading: false,
          loaded: true,
          items,
        },
      };

      expect(scripts.testing(state)).toEqual([
        {
          name: "testing script",
          description: "a testing script",
          type: 2,
        },
        {
          name: "testing script two",
          description: "another testing script",
          type: 2,
        },
      ]);
    });
  });
});
