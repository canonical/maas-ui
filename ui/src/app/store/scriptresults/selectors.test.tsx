import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  scriptResults as scriptResultsFactory,
  scriptResultsState as scriptResultsStateFactory,
} from "testing/factories";
import selectors from "./selectors";

describe("scriptResults selectors", () => {
  it("returns all script results", () => {
    const items = [scriptResultsFactory(), scriptResultsFactory()];
    const state = rootStateFactory({
      scriptresults: scriptResultsStateFactory({
        items,
      }),
    });

    expect(selectors.all(state)).toEqual(items);
  });

  it("returns script results for given machines ids", () => {
    const scriptResults = [
      scriptResultsFactory({ id: "foo" }),
      scriptResultsFactory({ id: "bar" }),
      scriptResultsFactory({ id: "baz" }),
    ];
    const items = [
      machineFactory({ system_id: "foo" }),
      machineFactory({ system_id: "bar" }),
      machineFactory({ system_id: "baz" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items,
      }),
      scriptresults: scriptResultsStateFactory({
        items: scriptResults,
      }),
    });

    expect(selectors.getByIds(state, ["foo", "baz"])).toHaveLength(2);
    expect(selectors.getByIds(state, ["foo", "bar"])[0].id).toEqual("foo");
    expect(selectors.getByIds(state, ["foo", "baz"])[1].id).toEqual("baz");
  });

  it("returns the loading state", () => {
    const state = rootStateFactory({
      scriptresults: scriptResultsStateFactory({
        loading: true,
      }),
    });

    expect(selectors.loading(state)).toEqual(true);
  });

  it("returns the loaded state", () => {
    const state = rootStateFactory({
      scriptresults: scriptResultsStateFactory({
        loaded: true,
      }),
    });

    expect(selectors.loaded(state)).toEqual(true);
  });

  it("returns the errors state", () => {
    const state = rootStateFactory({
      scriptresults: scriptResultsStateFactory({
        errors: "Data is incorrect",
      }),
    });

    expect(selectors.errors(state)).toStrictEqual("Data is incorrect");
  });
});
