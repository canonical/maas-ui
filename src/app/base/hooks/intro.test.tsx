import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { useCompletedIntro, useCompletedUserIntro } from "./intro";

import { ConfigNames } from "@/app/store/config/types";
import { getCookie } from "@/app/utils";
import * as factory from "@/testing/factories";
import type { Mock } from "vitest";

const mockStore = configureStore();

vi.mock("@/app/utils", async () => {
  const actual: object = await vi.importActual("@/app/utils");
  return { ...actual, getCookie: vi.fn() };
});

describe("intro hooks", () => {
  describe("useCompletedIntro", () => {
    it("gets whether the intro has been completed", () => {
      const state = factory.rootState({
        config: factory.configState({
          items: [
            factory.config({ name: ConfigNames.COMPLETED_INTRO, value: true }),
          ],
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
      const getCookieMock = getCookie as Mock;
      getCookieMock.mockImplementation(() => "true");
      const state = factory.rootState({
        config: factory.configState({
          items: [
            factory.config({ name: ConfigNames.COMPLETED_INTRO, value: false }),
          ],
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
      const state = factory.rootState({
        user: factory.userState({
          auth: factory.authState({
            user: factory.user({ completed_intro: true }),
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
      const getCookieMock = getCookie as Mock;
      getCookieMock.mockImplementation(() => "true");
      const state = factory.rootState({
        user: factory.userState({
          auth: factory.authState({
            user: factory.user({ completed_intro: false }),
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
