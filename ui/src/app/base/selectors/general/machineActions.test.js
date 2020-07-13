import {
  generalState as generalStateFactory,
  machineActionsState as machineActionsStateFactory,
  machineAction as machineActionFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import machineActions from "./machineActions";

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
      const state = {
        general: {
          machineActions: {
            data: [],
            errors: {},
            loaded: false,
            loading,
          },
        },
      };
      expect(machineActions.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns machineActions loaded state", () => {
      const loaded = true;
      const state = {
        general: {
          machineActions: {
            data: [],
            errors: {},
            loaded,
            loading: false,
          },
        },
      };
      expect(machineActions.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns machineActions errors state", () => {
      const errors = "Cannot fetch machineActions.";
      const state = {
        general: {
          machineActions: {
            data: [],
            errors,
            loaded: true,
            loading: false,
          },
        },
      };
      expect(machineActions.errors(state)).toStrictEqual(errors);
    });
  });

  it("can return actions by name", () => {
    const data = [
      {
        name: "commission",
        title: "Commission...",
        sentence: "commissioned",
        type: "lifecycle",
      },
      {
        name: "acquire",
        title: "Acquire...",
        sentence: "acquired",
        type: "lifecycle",
      },
      {
        name: "deploy",
        title: "Deploy...",
        sentence: "deployed",
        type: "lifecycle",
      },
    ];
    const state = {
      general: {
        machineActions: {
          data,
          errors: {},
          loaded: true,
          loading: false,
        },
      },
    };
    expect(machineActions.getByName(state, "acquire")).toStrictEqual({
      name: "acquire",
      title: "Acquire...",
      sentence: "acquired",
      type: "lifecycle",
    });
  });
});
