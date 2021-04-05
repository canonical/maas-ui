import reducers, { actions } from "./slice";

import {
  partialScriptResult as partialScriptResultFactory,
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
      history: {},
      logs: null,
    });
  });

  describe("get", () => {
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
      const existingScriptResult = scriptResultFactory();
      const newScriptResult = scriptResultFactory({ id: 2 });
      const scriptResultState = scriptResultStateFactory({
        items: [existingScriptResult],
        loading: true,
      });
      expect(
        reducers(scriptResultState, actions.getSuccess(newScriptResult))
      ).toEqual(
        scriptResultStateFactory({
          items: [existingScriptResult, newScriptResult],
          loading: false,
          history: { 2: [] },
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
    const existingScriptResult = scriptResultFactory({ id: 1 });
    const newScriptResult = scriptResultFactory({ id: 2 });
    const newScriptResult2 = scriptResultFactory({ id: 3 });

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
        history: { 2: [], 3: [] },
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

  it("reduces getHistoryStart", () => {
    const scriptResultState = scriptResultStateFactory({
      items: [],
      loading: false,
      history: {},
    });

    expect(reducers(scriptResultState, actions.getHistoryStart(null))).toEqual(
      scriptResultStateFactory({ loading: true })
    );
  });

  it("reduces getHistorySuccess", () => {
    const scriptResult = scriptResultFactory({ id: 123 });
    const partialScriptResult = partialScriptResultFactory({
      id: scriptResult.id,
    });

    const scriptResultState = scriptResultStateFactory({
      items: [scriptResult],
      loading: true,
      history: { 123: [] },
    });

    expect(
      reducers(scriptResultState, {
        meta: { item: { id: 123 } },
        ...actions.getHistorySuccess([partialScriptResult]),
      })
    ).toEqual(
      scriptResultStateFactory({
        items: [scriptResult],
        loading: false,
        loaded: true,
        history: { 123: [partialScriptResult] },
      })
    );
  });

  it("reduces getLogsStart", () => {
    const scriptResultState = scriptResultStateFactory({
      items: [],
      loading: false,
      history: {},
      logs: null,
    });

    expect(reducers(scriptResultState, actions.getLogsStart(null))).toEqual(
      scriptResultStateFactory({ loading: true })
    );
  });

  it("reduces getLogsSuccess", () => {
    const scriptResult = scriptResultFactory({ id: 123 });

    const scriptResultState = scriptResultStateFactory({
      items: [scriptResult],
      loading: true,
      logs: null,
    });

    expect(
      reducers(scriptResultState, {
        meta: { item: { id: 123, data_type: "combined" } },
        ...actions.getLogsSuccess("foo"),
      })
    ).toEqual(
      scriptResultStateFactory({
        items: [scriptResult],
        loading: false,
        loaded: true,
        logs: { 123: { combined: "foo" } },
      })
    );
  });

  it("reduces getLogsSuccess with additional logs", () => {
    const scriptResult = scriptResultFactory({ id: 123 });

    const scriptResultState = scriptResultStateFactory({
      items: [scriptResult],
      loading: true,
      logs: { 123: { combined: "foo" } },
    });

    expect(
      reducers(scriptResultState, {
        meta: { item: { id: 123, data_type: "result" } },
        ...actions.getLogsSuccess("bar"),
      })
    ).toEqual(
      scriptResultStateFactory({
        items: [scriptResult],
        loading: false,
        loaded: true,
        logs: { 123: { combined: "foo", result: "bar" } },
      })
    );
  });
});
