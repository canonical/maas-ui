import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useExitURL } from "./hooks";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

describe("hooks", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ completed_intro: false, is_superuser: true }),
        }),
      }),
    });
  });

  describe("useExitURL", () => {
    it("gets the exit URL for an admin", () => {
      state.user = userStateFactory({
        auth: authStateFactory({
          user: userFactory({ is_superuser: true }),
        }),
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useExitURL(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(urls.dashboard.index);
    });

    it("gets the exit URL for a non-admin", () => {
      state.user = userStateFactory({
        auth: authStateFactory({
          user: userFactory({ is_superuser: false }),
        }),
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useExitURL(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(urls.machines.index);
    });
  });
});
