import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useSettingsNavItems } from "./useSettingsNavItems";

import { settingsNavItems } from "@/app/settings/constants";

const mockStore = configureStore();

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

it("returns base nav items", () => {
  const store = mockStore();
  const { result } = renderHook(() => useSettingsNavItems(), {
    wrapper: generateWrapper(store),
  });
  expect(result.current).toStrictEqual(settingsNavItems);
});
