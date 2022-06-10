import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { useCompletedIntro, useCompletedUserIntro } from "./intro";

import { getCookie } from "app/utils";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.mock("app/utils", () => ({
  ...jest.requireActual("app/utils"),
  getCookie: jest.fn(),
}));

describe("intro hooks", () => {
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
});
