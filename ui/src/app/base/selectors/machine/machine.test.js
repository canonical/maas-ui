import machine from "./machine";

describe("machine selectors", () => {
  it("can get all items", () => {
    const state = {
      machine: {
        items: [{ name: "maas.test" }],
      },
    };
    expect(machine.all(state)).toEqual([{ name: "maas.test" }]);
  });

  it("can get the loading state", () => {
    const state = {
      machine: {
        loading: true,
        items: [],
      },
    };
    expect(machine.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      machine: {
        loaded: true,
        items: [],
      },
    };
    expect(machine.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      machine: {
        saving: true,
        items: [],
      },
    };
    expect(machine.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      machine: {
        saved: true,
        items: [],
      },
    };
    expect(machine.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = {
      machine: {
        errors: "Data is incorrect",
      },
    };
    expect(machine.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a machine by id", () => {
    const state = {
      machine: {
        items: [
          { name: "maas.test", system_id: 808 },
          { name: "10.0.0.99", system_id: 909 },
        ],
      },
    };
    expect(machine.getBySystemId(state, 909)).toStrictEqual({
      name: "10.0.0.99",
      system_id: 909,
    });
  });

  it("can get the error state", () => {
    const state = {
      machine: {
        errors: "Uh oh!",
        items: [],
        loaded: true,
      },
    };
    expect(machine.errors(state)).toEqual("Uh oh!");
  });
});
