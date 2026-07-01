import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useSettingsNavItems } from "./useSettingsNavItems";

import { settingsNavItems } from "@/app/settings/constants";
import settingsURLs from "@/app/settings/urls";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

it("returns base nav items when switch provisioning is disabled", () => {
  const store = mockStore(
    factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.EXPERIMENTAL_SWITCH_PROVISIONING,
            value: false,
          }),
        ],
      }),
    })
  );
  const { result } = renderHook(() => useSettingsNavItems(), {
    wrapper: generateWrapper(store),
  });
  expect(result.current).toStrictEqual(settingsNavItems);
});

it("appends Switch scripts nav item when switch provisioning is enabled", () => {
  const store = mockStore(
    factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.EXPERIMENTAL_SWITCH_PROVISIONING,
            value: true,
          }),
        ],
      }),
    })
  );
  const { result } = renderHook(() => useSettingsNavItems(), {
    wrapper: generateWrapper(store),
  });
  const scriptsSection = result.current.find((s) => s.label === "Scripts");
  expect(scriptsSection?.items).toContainEqual({
    path: settingsURLs.scripts.switch.index,
    label: "Switch scripts",
  });
});

it("does not modify non-Scripts sections when switch provisioning is enabled", () => {
  const store = mockStore(
    factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.EXPERIMENTAL_SWITCH_PROVISIONING,
            value: true,
          }),
        ],
      }),
    })
  );
  const { result } = renderHook(() => useSettingsNavItems(), {
    wrapper: generateWrapper(store),
  });
  const nonScriptsSections = result.current.filter(
    (s) => s.label !== "Scripts"
  );
  const baseSections = settingsNavItems.filter((s) => s.label !== "Scripts");
  expect(nonScriptsSections).toStrictEqual(baseSections);
});
