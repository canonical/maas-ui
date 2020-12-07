import reducers, { actions } from "./slice";

import {
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

describe("script result reducer", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces getStart", () => {
    const scriptResultState = scriptResultStateFactory({
      items: [],
      loading: false,
    });

    expect(reducers(scriptResultState, actions.getStart(null))).toEqual(
      scriptResultStateFactory({ loading: true })
    );
  });

  it("reduces getSuccess", () => {
    const newScriptResult = scriptResultFactory();
    const newScriptResult2 = scriptResultFactory();

    const scriptResultState = scriptResultStateFactory({
      items: [],
      loading: true,
    });

    expect(
      reducers(
        scriptResultState,
        actions.getSuccess({
          machine1: [newScriptResult],
          machine2: [newScriptResult2],
        })
      )
    ).toEqual(
      scriptResultStateFactory({
        items: [newScriptResult, newScriptResult2],
        loading: false,
        loaded: true,
      })
    );
  });

  it("reduces getError", () => {
    const scriptResultState = scriptResultStateFactory({ loading: true });

    expect(
      reducers(
        scriptResultState,
        actions.getError("Could not get script result")
      )
    ).toEqual(
      scriptResultStateFactory({
        errors: "Could not get script result",
        loading: false,
      })
    );
  });
});
