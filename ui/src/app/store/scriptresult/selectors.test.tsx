import selectors from "./selectors";

import {
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

describe("scriptResult selectors", () => {
  it("returns all script results", () => {
    const items = [scriptResultFactory(), scriptResultFactory()];
    const state = rootStateFactory({
      scriptResult: scriptResultStateFactory({
        items,
      }),
    });

    expect(selectors.all(state)).toEqual(items);
  });

  it("returns the loading state", () => {
    const state = rootStateFactory({
      scriptResult: scriptResultStateFactory({
        loading: true,
      }),
    });

    expect(selectors.loading(state)).toEqual(true);
  });

  it("returns the loaded state", () => {
    const state = rootStateFactory({
      scriptResult: scriptResultStateFactory({
        loaded: true,
      }),
    });

    expect(selectors.loaded(state)).toEqual(true);
  });

  it("returns the errors state", () => {
    const state = rootStateFactory({
      scriptResult: scriptResultStateFactory({
        errors: "Data is incorrect",
      }),
    });

    expect(selectors.errors(state)).toStrictEqual("Data is incorrect");
  });
});
