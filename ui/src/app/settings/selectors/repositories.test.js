import repositories from "./repositories";

describe("repositories selectors", () => {
  it("can get repository items", () => {
    const state = {
      packagerepository: {
        items: [{ name: "default" }]
      }
    };
    expect(repositories.get(state)).toEqual([{ name: "default" }]);
  });
});
