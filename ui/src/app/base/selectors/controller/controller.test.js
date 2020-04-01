import controller from "./controller";

describe("controller selectors", () => {
  it("can get all items", () => {
    const state = {
      controller: {
        items: [{ name: "maas.test" }],
      },
    };
    expect(controller.all(state)).toEqual([{ name: "maas.test" }]);
  });

  it("can get the loading state", () => {
    const state = {
      controller: {
        loading: true,
        items: [],
      },
    };
    expect(controller.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      controller: {
        loaded: true,
        items: [],
      },
    };
    expect(controller.loaded(state)).toEqual(true);
  });

  it("can get a controller by id", () => {
    const state = {
      controller: {
        items: [
          { name: "maas.test", system_id: 808 },
          { name: "10.0.0.99", system_id: 909 },
        ],
      },
    };
    expect(controller.getBySystemId(state, 909)).toStrictEqual({
      name: "10.0.0.99",
      system_id: 909,
    });
  });
});
