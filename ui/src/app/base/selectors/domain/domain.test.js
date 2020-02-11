import domain from "./domain";

describe("domain selectors", () => {
  it("can get all items", () => {
    const state = {
      domain: {
        items: [{ name: "maas.test" }]
      }
    };
    expect(domain.all(state)).toEqual([{ name: "maas.test" }]);
  });

  it("can get the loading state", () => {
    const state = {
      domain: {
        loading: true,
        items: []
      }
    };
    expect(domain.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      domain: {
        loaded: true,
        items: []
      }
    };
    expect(domain.loaded(state)).toEqual(true);
  });
});
