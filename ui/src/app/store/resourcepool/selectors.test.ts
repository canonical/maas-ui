import resourcepool from "./resourcepool";

describe("resourcepool selectors", () => {
  it("can get all items", () => {
    const items = [
      {
        id: 0,
        created: "Mon, 16 Sep. 2019 12:20:11",
        updated: "Mon, 16 Sep. 2019 12:20:11",
        name: "default",
        description: "Default pool",
        permissions: ["edit", "delete"],
        machine_total_count: 24,
        machine_ready_count: 1,
        is_default: true,
      },
    ];
    const state = {
      resourcepool: {
        items,
      },
    };
    expect(resourcepool.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = {
      resourcepool: {
        loading: true,
        items: [],
      },
    };
    expect(resourcepool.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      resourcepool: {
        loaded: true,
        items: [],
      },
    };
    expect(resourcepool.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      resourcepool: {
        saving: true,
        items: [],
      },
    };
    expect(resourcepool.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      resourcepool: {
        saved: true,
        items: [],
      },
    };
    expect(resourcepool.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = {
      resourcepool: {
        errors: "Data is incorrect",
      },
    };
    expect(resourcepool.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a pool by id", () => {
    const state = {
      resourcepool: {
        loading: true,
        items: [
          { name: "foo", id: 101 },
          { name: "bar", id: 123 },
        ],
      },
    };
    expect(resourcepool.getById(state, 101)).toStrictEqual({
      name: "foo",
      id: 101,
    });
  });
});
