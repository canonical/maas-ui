import { renderHook } from "@testing-library/react-hooks";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import TestRenderer from "react-test-renderer";
import configureStore from "redux-mock-store";

import type { MachineMenuAction } from "./hooks";
import {
  useCompletedIntro,
  useCompletedUserIntro,
  useCycled,
  useMachineActions,
  useScrollOnRender,
} from "./hooks";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import { getCookie } from "app/utils";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineAction as machineActionFactory,
  machineActionsState as machineActionsStateFactory,
  machineState as machineStateFactory,
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

  describe("useMachineActions", () => {
    let state: RootState;
    const HookWrapper = ({ action }: { action: MachineMenuAction }) => {
      const actions = useMachineActions("abc123", [action]);
      return (
        <>
          {actions.map((buttonProps, i) => (
            <button {...buttonProps} key={i} />
          ))}
        </>
      );
    };

    const dispatchAction = (
      action: MachineMenuAction,
      expectedType: string
    ) => {
      state.general.machineActions.data[0].name = action;
      state.machine.items[0].actions = [action];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <HookWrapper action={action} />
        </Provider>
      );
      wrapper.find("button").simulate("click");
      return store.getActions().find((action) => action.type === expectedType);
    };

    beforeEach(() => {
      state = rootStateFactory({
        general: generalStateFactory({
          machineActions: machineActionsStateFactory({
            data: [machineActionFactory()],
          }),
        }),
        machine: machineStateFactory({
          items: [
            machineFactory({
              system_id: "abc123",
              actions: [],
            }),
          ],
        }),
      });
    });

    it("can dispatch an abort action", () => {
      const action = NodeActions.ABORT;
      const expected = machineActions.abort("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch an acquire action", () => {
      const action = NodeActions.ACQUIRE;
      const expected = machineActions.acquire("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a commission action", () => {
      const action = NodeActions.COMMISSION;
      const expected = machineActions.commission({ systemId: "abc123" });
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a delete action", () => {
      const action = NodeActions.DELETE;
      const expected = machineActions.delete("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a deploy action", () => {
      const action = NodeActions.DEPLOY;
      const expected = machineActions.deploy({ systemId: "abc123" });
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch an exit-rescue-mode action", () => {
      const action = NodeActions.EXIT_RESCUE_MODE;
      const expected = machineActions.exitRescueMode("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a lock action", () => {
      const action = NodeActions.LOCK;
      const expected = machineActions.lock("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a mark-broken action", () => {
      const action = NodeActions.MARK_BROKEN;
      const expected = machineActions.markBroken({ systemId: "abc123" });
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a mark-fixed action", () => {
      const action = NodeActions.MARK_FIXED;
      const expected = machineActions.markFixed("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch an off action", () => {
      const action = NodeActions.OFF;
      const expected = machineActions.off("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch an on action", () => {
      const action = NodeActions.ON;
      const expected = machineActions.on("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch an override-failed-testing action", () => {
      const action = NodeActions.OVERRIDE_FAILED_TESTING;
      const expected = machineActions.overrideFailedTesting("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a release action", () => {
      const action = NodeActions.RELEASE;
      const expected = machineActions.release({ systemId: "abc123" });
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a rescue-mode action", () => {
      const action = NodeActions.RESCUE_MODE;
      const expected = machineActions.rescueMode("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch a test action", () => {
      const action = NodeActions.TEST;
      const expected = machineActions.test({ systemId: "abc123" });
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });

    it("can dispatch an unlock action", () => {
      const action = NodeActions.UNLOCK;
      const expected = machineActions.unlock("abc123");
      const dispatched = dispatchAction(action, expected.type);
      expect(dispatched).toStrictEqual(expected);
    });
  });
});
