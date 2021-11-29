import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import TestRenderer from "react-test-renderer";
import type { MockStoreEnhanced } from "redux-mock-store";
import configureStore from "redux-mock-store";

import {
  useCanEdit,
  useCompletedIntro,
  useCompletedUserIntro,
  useCycled,
  useIsRackControllerConnected,
  useScrollOnRender,
} from "./hooks";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { getCookie } from "app/utils";
import {
  architecturesState as architecturesStateFactory,
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const { act } = TestRenderer;

jest.mock("app/utils", () => ({
  ...jest.requireActual("app/utils"),
  getCookie: jest.fn(),
}));

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

describe("hooks", () => {
  describe("useScrollOnRender", () => {
    let html: HTMLHtmlElement | null;
    let scrollToSpy: jest.Mock;
    let targetNode: HTMLElement;

    beforeEach(() => {
      global.innerHeight = 500;
      html = document.querySelector("html");
      scrollToSpy = jest.fn();
      global.scrollTo = scrollToSpy;
      targetNode = document.createElement("div");
    });

    afterEach(() => {
      if (html) {
        html.scrollTop = 0;
      }
    });

    it("does not scroll if the target is on screen", () => {
      if (html) {
        html.scrollTop = 10;
      }
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () => ({ y: 10 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it("scrolls if the target is off the bottom of the screen", () => {
      if (html) {
        html.scrollTop = 100;
      }
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () => ({ y: 1000 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 1000,
        left: 0,
        behavior: "smooth",
      });
    });

    it("scrolls if the target is off the top of the screen", () => {
      if (html) {
        html.scrollTop = 1000;
      }
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () => ({ y: 10 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 10,
        left: 0,
        behavior: "smooth",
      });
    });

    it("scrolls if the target is partially off the bottom of the screen", () => {
      if (html) {
        html.scrollTop = 100;
      }
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () =>
        ({ height: 400, y: 400 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 400,
        left: 0,
        behavior: "smooth",
      });
    });
  });

  describe("useCycled", () => {
    it("can handle the initial state", () => {
      const onCycled = jest.fn();
      const { result } = renderHook(() => useCycled(false, onCycled));
      const [hasCycled] = result.current;
      expect(hasCycled).toBe(false);
      expect(onCycled).not.toHaveBeenCalled();
    });

    it("can handle rerenders when the value has not cycled", () => {
      const onCycled = jest.fn();
      const { result, rerender } = renderHook(
        ({ state }) => useCycled(state, onCycled),
        {
          initialProps: { state: false },
        }
      );
      rerender({ state: false });
      const [hasCycled] = result.current;
      expect(hasCycled).toBe(false);
      expect(onCycled).not.toHaveBeenCalled();
    });

    it("can handle rerenders when the value has cycled", () => {
      const onCycled = jest.fn();
      const { result, rerender } = renderHook(
        ({ state }) => useCycled(state, onCycled),
        {
          initialProps: { state: false },
        }
      );
      rerender({ state: true });
      const [hasCycled] = result.current;
      expect(hasCycled).toBe(true);
      expect(onCycled).toHaveBeenCalled();
    });

    it("can reset the cycle", () => {
      const onCycled = jest.fn();
      const { result, rerender } = renderHook(
        ({ state }) => useCycled(state, onCycled),
        {
          initialProps: { state: false },
        }
      );
      rerender({ state: true });
      let [hasCycled, resetCycle] = result.current;
      expect(hasCycled).toBe(true);
      expect(onCycled).toHaveBeenCalledTimes(1);
      act(() => {
        resetCycle();
      });
      [hasCycled, resetCycle] = result.current;
      expect(hasCycled).toBe(false);
      // The onCycle function should not get called when it resets.
      expect(onCycled).toHaveBeenCalledTimes(1);
    });

    it("can handle values that have cycled after a reset", () => {
      const onCycled = jest.fn();
      const { result, rerender } = renderHook(
        ({ state }) => useCycled(state, onCycled),
        {
          initialProps: { state: false },
        }
      );
      // Cycle the value to true:
      rerender({ state: true });
      let [hasCycled, resetCycle] = result.current;
      expect(hasCycled).toBe(true);
      // Reset to false:
      act(() => {
        resetCycle();
      });
      rerender({ state: false });
      [hasCycled, resetCycle] = result.current;
      expect(hasCycled).toBe(false);
      // Cycle the value back to true:
      rerender({ state: true });
      [hasCycled, resetCycle] = result.current;
      expect(hasCycled).toBe(true);
      expect(onCycled).toHaveBeenCalledTimes(2);
    });
  });

  describe("useCompletedIntro", () => {
    it("gets whether the intro has been completed", () => {
      const state = rootStateFactory({
        config: configStateFactory({
          items: [configFactory({ name: "completed_intro", value: true })],
        }),
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCompletedIntro(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current).toBe(true);
    });

    it("gets whether the intro has been skipped", () => {
      const getCookieMock = getCookie as jest.Mock;
      getCookieMock.mockImplementation(() => "true");
      const state = rootStateFactory({
        config: configStateFactory({
          items: [configFactory({ name: "completed_intro", value: false })],
        }),
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCompletedIntro(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current).toBe(true);
      getCookieMock.mockReset();
    });
  });

  describe("useCompletedUserIntro", () => {
    it("gets whether the user intro has been completed", () => {
      const state = rootStateFactory({
        user: userStateFactory({
          auth: authStateFactory({
            user: userFactory({ completed_intro: true }),
          }),
        }),
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCompletedUserIntro(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current).toBe(true);
    });

    it("gets whether the user intro has been skipped", () => {
      const getCookieMock = getCookie as jest.Mock;
      getCookieMock.mockImplementation(() => "true");
      const state = rootStateFactory({
        user: userStateFactory({
          auth: authStateFactory({
            user: userFactory({ completed_intro: false }),
          }),
        }),
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCompletedUserIntro(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current).toBe(true);
      getCookieMock.mockReset();
    });
  });

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
