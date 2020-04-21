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

  it("can get the machine statuses", () => {
    const state = {
      machine: {
        statuses: {
          808: {},
          909: {},
        },
      },
    };
    expect(machine.statuses(state)).toStrictEqual({
      808: {},
      909: {},
    });
  });

  it("can get machines that are saving pools", () => {
    const state = {
      machine: {
        items: [{ system_id: 808 }, { system_id: 909 }],
        statuses: {
          808: { settingPool: false },
          909: { settingPool: true },
        },
      },
    };
    expect(machine.settingPool(state)).toStrictEqual([{ system_id: 909 }]);
  });

  it("can get machines that are both selected and saving pools", () => {
    const state = {
      machine: {
        items: [{ system_id: 808 }, { system_id: 808 }, { system_id: 909 }],
        selected: [909],
        statuses: {
          707: { settingPool: true },
          808: { settingPool: false },
          909: { settingPool: true },
        },
      },
    };
    expect(machine.settingPoolSelected(state)).toStrictEqual([
      { system_id: 909 },
  it("returns failed script results for selected machines", () => {
    const state = {
      machine: {
        items: [
          { name: "selectedMachine", system_id: "foo" },
          { name: "unselectedMachine", system_id: "bar" },
        ],
        selected: ["foo"],
      },
      scriptresults: {
        errors: {},
        loading: false,
        loaded: true,
        items: {
          foo: [
            {
              id: 1,
              name: "script1",
            },
            {
              id: 2,
              name: "script2",
            },
          ],
          bar: [
            {
              id: 2,
              name: "script2",
            },
            {
              id: 3,
              name: "script3",
            },
          ],
        },
      },
    };

    expect(machine.failedScriptResults(state)).toEqual([
      { id: 1, name: "script1" },
      { id: 2, name: "script2" },
    ]);
  });
});
