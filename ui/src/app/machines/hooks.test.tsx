import React from "react";
import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useMachineActionForm } from "./hooks";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper = (store: MockStoreEnhanced<unknown>) => ({
  children,
}: {
  children: ReactNode;
}) => <Provider store={store}>{children}</Provider>;

describe("machine utils", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            id: "abc123",
            event: NodeActions.TAG,
            error: "uh oh",
          }),
          machineEventErrorFactory({
            id: "def456",
            event: NodeActions.TAG,
            error: "bananas",
          }),
          machineEventErrorFactory({ event: NodeActions.TAG }),
        ],
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory({
            tagging: true,
          }),
          def456: machineStatusFactory({
            tagging: true,
          }),
        },
      }),
    });
  });

  describe("useMachineActionForm", () => {
    it("can return errors for an active machine", () => {
      state.machine.active = "abc123";
      const store = mockStore(state);
      const { result } = renderHook(
        () => useMachineActionForm(NodeActions.TAG),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current.errors).toBe("uh oh");
    });

    it("can return errors for selected machines", () => {
      state.machine.selected = ["abc123", "def456"];
      const store = mockStore(state);
      const { result } = renderHook(
        () => useMachineActionForm(NodeActions.TAG),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current.errors).toStrictEqual("uh oh");
    });
  });
});
