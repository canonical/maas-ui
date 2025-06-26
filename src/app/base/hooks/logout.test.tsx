import configureStore from "redux-mock-store";

import { useLogout } from "./logout";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderHookWithProviders } from "@/testing/utils";

const mockStore = configureStore();

describe("useLogout", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState(),
    });
  });

  it("removes 'maas-config' from local storage", () => {
    localStorage.setItem("maas-config", "abc123");
    const { result } = renderHookWithProviders(useLogout, { state });

    // Run the logout function
    result.current();

    expect(localStorage.getItem("maas-config")).toBe(null);
  });

  it("dispatches an action to log out", () => {
    const store = mockStore(state);

    const { result } = renderHookWithProviders(useLogout, { store });

    result.current();

    expect(store.getActions()).toStrictEqual([
      { payload: null, type: "status/logout" },
    ]);
  });
});
