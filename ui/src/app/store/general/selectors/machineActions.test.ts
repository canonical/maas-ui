import machineActions from "./machineActions";

import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machineActionsState as machineActionsStateFactory,
  machineAction as machineActionFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("machineActions selectors", () => {
  describe("get", () => {
    it("returns machineActions", () => {
      const data = [machineActionFactory(), machineActionFactory()];
      const state = rootStateFactory({
        general: generalStateFactory({
          machineActions: machineActionsStateFactory({
            data,
          }),
        }),
      });
      expect(machineActions.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns machineActions loading state", () => {
      const loading = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          machineActions: machineActionsStateFactory({
            loading,
          }),
        }),
      });
      expect(machineActions.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns machineActions loaded state", () => {
      const loaded = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          machineActions: machineActionsStateFactory({
            loaded,
          }),
        }),
      });
      expect(machineActions.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns machineActions errors state", () => {
      const errors = "Cannot fetch machineActions.";
      const state = rootStateFactory({
        general: generalStateFactory({
          machineActions: machineActionsStateFactory({
            errors,
          }),
        }),
      });
      expect(machineActions.errors(state)).toStrictEqual(errors);
    });
  });

  it("can return actions by name", () => {
    const data = [
      {
        name: NodeActions.COMMISSION,
        title: "Commission...",
        sentence: "commissioned",
        type: "lifecycle",
      },
      {
        name: NodeActions.ACQUIRE,
        title: "Acquire...",
        sentence: "acquired",
        type: "lifecycle",
      },
      {
        name: NodeActions.DEPLOY,
        title: "Deploy...",
        sentence: "deployed",
        type: "lifecycle",
      },
    ];
    const state = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data,
        }),
      }),
    });
    expect(machineActions.getByName(state, NodeActions.ACQUIRE)).toStrictEqual({
      name: NodeActions.ACQUIRE,
      title: "Acquire...",
      sentence: "acquired",
      type: "lifecycle",
    });
  });
});
