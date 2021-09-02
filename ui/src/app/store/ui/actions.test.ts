import { actions } from "./slice";

import { MachineMeta } from "app/store/machine/types";

describe("ui actions", () => {
  it("should handle opening a form", () => {
    expect(
      actions.openHeaderForm({
        model: MachineMeta.MODEL,
        name: "test",
        extra: { applyConfiguredNetworking: true },
      })
    ).toStrictEqual({
      type: "ui/openHeaderForm",
      payload: {
        model: MachineMeta.MODEL,
        name: "test",
        extra: { applyConfiguredNetworking: true },
      },
    });
  });

  it("should handle clearing the form", () => {
    expect(actions.clearHeaderForm()).toStrictEqual({
      type: "ui/clearHeaderForm",
      payload: undefined,
    });
  });
});
