import configuration from "./configuration";

describe("configuraton", () => {
  it("can get items", () => {
    const state = {
      configuration: {
        items: [{ name: "default" }]
      }
    };
    expect(configuration.all(state)).toEqual([{ name: "default" }]);
  });

  it("can get the loading state", () => {
    const state = {
      configuration: {
        loading: true,
        items: []
      }
    };
    expect(configuration.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      configuration: {
        loaded: true,
        items: []
      }
    };
    expect(configuration.loaded(state)).toEqual(true);
  });
});
