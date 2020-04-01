import zone from "./zone";

describe("zone selectors", () => {
  it("can get all items", () => {
    const items = [
      {
        id: 1,
        created: "Mon, 16 Sep. 2019 12:19:56",
        updated: "Mon, 16 Sep. 2019 12:19:56",
        name: "default",
        description: "",
        devices_count: 15,
        machines_count: 0,
        controllers_count: 0,
      },
    ];
    const state = {
      zone: {
        items,
      },
    };
    expect(zone.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = {
      zone: {
        loading: true,
        items: [],
      },
    };
    expect(zone.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      zone: {
        loaded: true,
        items: [],
      },
    };
    expect(zone.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = {
      zone: {
        errors: "Data is incorrect",
      },
    };
    expect(zone.errors(state)).toStrictEqual("Data is incorrect");
  });
});
