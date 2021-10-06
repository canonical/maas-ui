import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useActivePod } from "./hooks";

import { actions as podActions } from "app/store/pod";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

describe("kvm hooks", () => {
  describe("useActivePod", () => {
    it("gets and sets active pod", () => {
      const state = rootStateFactory();
      const store = mockStore(state);
      const podId = 1;
      renderHook(() => useActivePod(podId), {
        wrapper: generateWrapper(store),
      });

      const expectedActions = [
        podActions.get(podId),
        podActions.setActive(podId),
      ];
      const actualActions = store.getActions();
      expectedActions.forEach((expectedAction) => {
        expect(
          actualActions.find(
            (actualAction) => actualAction.type === expectedAction.type
          )
        ).toStrictEqual(expectedAction);
      });
    });

    it("unsets active pod on unmount", () => {
      const state = rootStateFactory();
      const store = mockStore(state);
      const podId = 1;
      const { unmount } = renderHook(() => useActivePod(podId), {
        wrapper: generateWrapper(store),
      });
      unmount();

      const expectedAction = podActions.setActive(null);
      const setActiveActions = store
        .getActions()
        .filter((action) => action.type === expectedAction.type);
      // The setActive action is also used to unset the active pod, so we check
      // the second instance.
      expect(setActiveActions[1]).toStrictEqual(expectedAction);
    });
  });
});
