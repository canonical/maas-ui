import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import { useGetURLId } from "./urls";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

const generateWrapper =
  (pathname: string, route: string) =>
  ({ children }: { children: ReactNode }) =>
    (
      <Provider store={mockStore(rootStateFactory())}>
        <MemoryRouter initialEntries={[{ pathname }]}>
          <Route exact path={route} render={() => <>{children}</>} />
        </MemoryRouter>
      </Provider>
    );

describe("url hooks", () => {
  describe("useGetURLId", () => {
    it("handles a number id", () => {
      const { result } = renderHook(() => useGetURLId("id"), {
        wrapper: generateWrapper("/host/1", "/host/:id"),
      });
      expect(result.current).toBe(1);
    });

    it("handles a string system_id", () => {
      const { result } = renderHook(() => useGetURLId("system_id"), {
        wrapper: generateWrapper("/host/abc123", "/host/:id"),
      });
      expect(result.current).toBe("abc123");
    });

    it("handles a provided id key", () => {
      const { result } = renderHook(() => useGetURLId("id", "host_id"), {
        wrapper: generateWrapper("/host/1", "/host/:host_id"),
      });
      expect(result.current).toBe(1);
    });
  });
});
