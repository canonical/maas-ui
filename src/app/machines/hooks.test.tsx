import type { ReactNode } from "react";

import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useMachineDetailsForm } from "./hooks";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.mock("@canonical/react-components/dist/hooks", () => ({
  usePrevious: jest.fn(),
}));

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

describe("machine utils", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            id: "abc123",
            event: "markFixed",
            error: "uh oh",
          }),
          machineEventErrorFactory({
            id: "def456",
            event: "markFixed",
            error: "bananas",
          }),
          machineEventErrorFactory({ event: "markFixed" }),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("useMachineDetailsForm", () => {
    it("can return saving state for a machine performing an action", () => {
      state.machine.statuses.abc123.deletingFilesystem = true;
      const store = mockStore(state);
      const { result } = renderHook(
        () =>
          useMachineDetailsForm(
            "abc123",
            "deletingFilesystem",
            "deleteFilesystem",
            jest.fn()
          ),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current.saving).toBe(true);
    });

    it("can return error state for a machine performing an action", () => {
      state.machine.eventErrors = [
        machineEventErrorFactory({
          error: "front fell off",
          event: "deleteFilesystem",
          id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const { result } = renderHook(
        () =>
          useMachineDetailsForm(
            "abc123",
            "deletingFilesystem",
            "deleteFilesystem",
            jest.fn()
          ),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current.errors).toBe("front fell off");
    });

    it("can return saved state for a machine performing an action", () => {
      // Mock previous saving value to be true
      jest
        .spyOn(reactComponentHooks, "usePrevious")
        .mockImplementation(() => true);
      state.machine.statuses.abc123.deletingFilesystem = false;
      const store = mockStore(state);
      const { result } = renderHook(
        () =>
          useMachineDetailsForm(
            "abc123",
            "deletingFilesystem",
            "deleteFilesystem",
            jest.fn()
          ),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current.saved).toBe(true);
    });

    it("runs the onSaved function if successfully saved", () => {
      // Mock previous saving value to be true
      jest
        .spyOn(reactComponentHooks, "usePrevious")
        .mockImplementation(() => true);
      state.machine.statuses.abc123.deletingFilesystem = false;
      const onSaved = jest.fn();
      const store = mockStore(state);
      renderHook(
        () =>
          useMachineDetailsForm(
            "abc123",
            "deletingFilesystem",
            "deleteFilesystem",
            onSaved
          ),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(onSaved).toHaveBeenCalled();
    });

    it("does not run the onSaved function if errors are present", () => {
      // Mock previous saving value to be true
      jest
        .spyOn(reactComponentHooks, "usePrevious")
        .mockImplementation(() => true);
      state.machine.eventErrors = [
        machineEventErrorFactory({
          error: "front fell off",
          event: "deleteFilesystem",
          id: "abc123",
        }),
      ];
      state.machine.statuses.abc123.deletingFilesystem = false;
      const onSaved = jest.fn();
      const store = mockStore(state);
      renderHook(
        () =>
          useMachineDetailsForm(
            "abc123",
            "deletingFilesystem",
            "deleteFilesystem",
            onSaved
          ),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(onSaved).not.toHaveBeenCalled();
    });
  });
});
