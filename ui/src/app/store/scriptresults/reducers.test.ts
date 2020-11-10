import {
  scriptResult as scriptResultFactory,
  scriptResultsState as scriptResultsStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("script results reducer", () => {
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
    const scriptResultsState = scriptResultsStateFactory({
      items: [],
      loading: false,
    });

    expect(reducers(scriptResultsState, actions.getStart(null))).toEqual(
      scriptResultsStateFactory({ loading: true })
    );
  });

  it("reduces getSuccess", () => {
    const newScriptResult = scriptResultFactory();

    const scriptResultsState = scriptResultsStateFactory({
      items: [],
      loading: true,
    });

    expect(
      reducers(
        scriptResultsState,
        actions.getSuccess({
          machine1: [newScriptResult],
        })
      )
    ).toEqual(
      scriptResultsStateFactory({
        items: [{ id: "machine1", results: [newScriptResult] }],
        loading: false,
      })
    );
  });

  it("reduces getError", () => {
    const scriptResultsState = scriptResultsStateFactory({ loading: true });

    expect(
      reducers(
        scriptResultsState,
        actions.getError("Could not get script results")
      )
    ).toEqual(
      scriptResultsStateFactory({
        errors: "Could not get script results",
        loading: false,
      })
    );
  });
});
