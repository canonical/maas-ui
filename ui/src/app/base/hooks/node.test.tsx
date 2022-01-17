import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import type { MockStoreEnhanced } from "redux-mock-store";
import configureStore from "redux-mock-store";

import { useCanEdit, useIsRackControllerConnected } from "./node";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

describe("node hooks", () => {
  describe("useIsRackControllerConnected", () => {
    let state: RootState;

    beforeEach(() => {
      state = rootStateFactory({
        general: generalStateFactory({
          architectures: architecturesStateFactory({
            data: ["amd64"],
          }),
          osInfo: osInfoStateFactory({
            data: osInfoFactory(),
          }),
          powerTypes: powerTypesStateFactory({
            data: [powerTypeFactory()],
          }),
        }),
      });
    });

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
          osInfo: osInfoStateFactory({
            data: osInfoFactory(),
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
