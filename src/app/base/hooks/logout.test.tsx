import { useLogout } from "./logout";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderHookWithProviders } from "@/testing/utils";

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
    const { result, store } = renderHookWithProviders(useLogout, { state });

    result.current();

    expect(store.getActions()).toStrictEqual([
      { payload: null, type: "status/logout" },
    ]);
  });

  it("clears the 'maas_v3_access_token' cookie", () => {
    document.cookie =
      "maas_v3_access_token=some_token_value; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    const { result } = renderHookWithProviders(useLogout, { state });

    result.current();

    expect(document.cookie).not.toContain(
      "maas_v3_access_token=some_token_value"
    );
  });
});
