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

  it("reduces getByMachineIdStart", () => {
    const scriptResultState = scriptResultStateFactory({
      items: [],
      loading: false,
    });

    expect(
      reducers(scriptResultState, actions.getByMachineIdStart(null))
    ).toEqual(scriptResultStateFactory({ loading: true }));
  });

  it("reduces getByMachineIdSuccess", () => {
    const existingScriptResult = scriptResultFactory();
    const newScriptResult = scriptResultFactory();
    const newScriptResult2 = scriptResultFactory();

    const scriptResultState = scriptResultStateFactory({
      items: [existingScriptResult],
      loading: true,
    });

    expect(
      reducers(
        scriptResultState,
        actions.getByMachineIdSuccess([newScriptResult, newScriptResult2])
      )
    ).toEqual(
      scriptResultStateFactory({
        items: [existingScriptResult, newScriptResult, newScriptResult2],
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
        actions.getByMachineIdError("Could not get script result")
      )
    ).toEqual(
      scriptResultStateFactory({
        errors: "Could not get script result",
        loading: false,
      })
    );
  });

  it("reduce updateNotify for noderesult", () => {
    const scriptResultState = scriptResultStateFactory({
      items: [scriptResultFactory({ id: 1 })],
    });
    const updatedScriptResult = scriptResultFactory({ id: 1 });

    expect(
      reducers(scriptResultState, {
        type: "noderesult/updateNotify",
        payload: updatedScriptResult,
      })
    ).toEqual(
      scriptResultStateFactory({
        items: [updatedScriptResult],
      })
    );
  });
});
