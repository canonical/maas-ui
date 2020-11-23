import reducers, { actions } from "./slice";

import {
  nodeResult as nodeResultFactory,
  nodeResultState as nodeResultStateFactory,
} from "testing/factories";

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
    const nodeResultState = nodeResultStateFactory({
      items: [],
      loading: false,
    });

    expect(reducers(nodeResultState, actions.getStart(null))).toEqual(
      nodeResultStateFactory({ loading: true })
    );
  });

  it("reduces getSuccess", () => {
    const newNodeResult = nodeResultFactory();

    const nodeResultState = nodeResultStateFactory({
      items: [],
      loading: true,
    });

    // meta is set by a redux saga, so we insert it manually here
    const actionResult = {
      meta: { item: { system_id: "machine1" } },
      ...actions.getSuccess([newNodeResult]),
    };

    expect(reducers(nodeResultState, actionResult)).toEqual(
      nodeResultStateFactory({
        items: [{ id: "machine1", results: [newNodeResult] }],
        loading: false,
      })
    );
  });

  it("reduces getError", () => {
    const nodeResultState = nodeResultStateFactory({ loading: true });

    expect(
      reducers(nodeResultState, actions.getError("Could not get node results"))
    ).toEqual(
      nodeResultStateFactory({
        errors: "Could not get node results",
        loading: false,
      })
    );
  });
});
