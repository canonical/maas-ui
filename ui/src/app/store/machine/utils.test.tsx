import { Provider } from "react-redux";
import { renderHook } from "@testing-library/react-hooks";
import configureStore from "redux-mock-store";
import React from "react";
import type { MockStoreEnhanced } from "redux-mock-store";
import type { ReactNode } from "react";

import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

import {
  useCanEdit,
  useHasInvalidArchitecture,
  useIsRackControllerConnected,
} from "./utils";

const mockStore = configureStore();

const generateWrapper = (store: MockStoreEnhanced<unknown>) => ({
  children,
}: {
  children: ReactNode;
}) => <Provider store={store}>{children}</Provider>;

describe("machine utils", () => {
  let state: RootState;
  let machine: Machine | null;

  beforeEach(() => {
    machine = machineFactory({
      architecture: "amd64",
      events: [machineEventFactory()],
      locked: false,
      permissions: ["edit"],
      system_id: "abc123",
    });
    state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64"],
        }),
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        items: [machine],
      }),
    });
  });

  describe("useHasInvalidArchitecture", () => {
    it("can return a valid result", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useHasInvalidArchitecture(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("handles a machine that has no architecture", () => {
      state.machine.items[0].architecture = "";
      const store = mockStore(state);
      const { result } = renderHook(() => useHasInvalidArchitecture(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("handles an architecture with no match", () => {
      state.machine.items[0].architecture = "unknown";
      const store = mockStore(state);
      const { result } = renderHook(() => useHasInvalidArchitecture(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });
  });

  describe("useIsRackControllerConnected", () => {
    it("handles a connected state", () => {
      state.general.powerTypes = powerTypesStateFactory({
        data: [powerTypeFactory()],
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useIsRackControllerConnected(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("handles a disconnected state", () => {
      state.general.powerTypes.data = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useIsRackControllerConnected(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });
  });

  describe("useCanEdit", () => {
    it("handles an editable machine", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("handles incorrect permissions", () => {
      state.machine.items[0].permissions = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("handles a locked machine", () => {
      state.machine.items[0].locked = true;
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("handles a disconnected rack controller", () => {
      state.general.powerTypes.data = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("can ignore the rack controller state", () => {
      state.general.powerTypes.data = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine, true), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });
  });
});
