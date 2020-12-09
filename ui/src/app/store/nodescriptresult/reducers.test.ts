import { actions as scriptResultActions } from "../scriptresult/slice";

import reducers from "./slice";

import { scriptResult as scriptResultFactory } from "testing/factories";

describe("nodescriptresult reducer", () => {
  it("reduces getByMachineIdSuccess", () => {
    const nodeScriptResultState = { byId: null };

    const scriptResults = [
      scriptResultFactory({ id: 1 }),
      scriptResultFactory({ id: 2 }),
    ];

    expect(
      reducers(nodeScriptResultState, {
        ...scriptResultActions.getByMachineIdSuccess(scriptResults),
        meta: { item: { system_id: "abc123" } },
      })
    ).toEqual({
      byId: {
        abc123: [1, 2],
      },
    });
  });
});
