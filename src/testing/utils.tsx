import fs from "fs";
import path from "path";

import type { ProfilerOnRenderCallback, ReactNode } from "react";
import { Profiler } from "react";

import {
  expectTooltipOnHover,
  mockIsPending,
  mockSidePanel,
  renderHookWithProviders as libRenderHookWithProviders,
  renderWithProviders as libRenderWithProviders,
  setupMockServer as libSetupMockServer,
  spyOnMutation,
  waitForLoading,
} from "@canonical/maas-react-components/testing";
import type { QueryClient } from "@tanstack/react-query";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import type { RequestHandler } from "msw";
import { Provider } from "react-redux";
import type { DataRouter, InitialEntry } from "react-router";
import type { MockStoreEnhanced } from "redux-mock-store";
import configureStore from "redux-mock-store";
import { vi } from "vitest";

import { client } from "@/app/apiclient/client.gen";
import { WebSocketProvider } from "@/app/base/websocket-context";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  config as configFactory,
  configState as configStateFactory,
  domainState as domainStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "@/testing/factories";

const getMockStore = (state = factory.rootState()) => {
  const mockStore = configureStore();
  return mockStore(state);
};

// Complete initial test state with all queryData loaded and no errors
export const getTestState = (): RootState => {
  const config = configFactory({
    name: ConfigNames.SESSION_LENGTH,
    value: 1209600, // This is the default session length for MAAS in seconds, equivalent to 14 days
  });
  const fabric = fabricFactory({ name: "pxe-fabric" });
  const nonBootVlan = vlanFactory({ fabric: fabric.id });
  const bootVlan = vlanFactory({ fabric: fabric.id, name: "pxe-vlan" });
  const nonBootSubnet = subnetFactory({ vlan: nonBootVlan.id });
  const bootSubnet = subnetFactory({ name: "pxe-subnet", vlan: bootVlan.id });
  const pod = podDetailsFactory({
    attached_vlans: [nonBootVlan.id, bootVlan.id],
    boot_vlans: [bootVlan.id],
    id: 1,
  });
  return rootStateFactory({
    config: configStateFactory({
      loaded: true,
      items: [config],
    }),
    domain: domainStateFactory({
      loaded: true,
    }),
    fabric: fabricStateFactory({
      items: [fabric],
      loaded: true,
    }),
    general: generalStateFactory({
      powerTypes: powerTypesStateFactory({
        data: [powerTypeFactory()],
        loaded: true,
      }),
    }),
    pod: podStateFactory({
      items: [pod],
      loaded: true,
      statuses: { [pod.id]: podStatusFactory() },
    }),
    space: spaceStateFactory({
      loaded: true,
    }),
    subnet: subnetStateFactory({
      items: [nonBootSubnet, bootSubnet],
      loaded: true,
    }),
    vlan: vlanStateFactory({
      items: [nonBootVlan, bootVlan],
      loaded: true,
    }),
  });
};

type Hook = Parameters<typeof renderHook>[0];
export const renderHookWithMockStore = (
  hook: Hook,
  options?: { initialState?: RootState }
) => {
  let store = configureStore()(options?.initialState || rootStateFactory());
  const wrapper = ({ children }: { children: ReactNode }) => (
    <WebSocketProvider>
      <Provider store={store}>{children}</Provider>
    </WebSocketProvider>
  );

  const result = renderHook(hook, { wrapper });

  const customRerender = (
    newHook?: Hook,
    { state: newState }: { state?: Partial<RootState> } = {}
  ) => {
    if (newState) {
      store = configureStore()({ ...newState });
    }
    result.rerender(newHook);
  };

  return {
    ...result,
    rerender: customRerender,
    store,
  };
};

export const waitFor = vi.waitFor;
export {
  act,
  cleanup,
  fireEvent,
  getDefaultNormalizer,
  render,
  renderHook,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

/* New utils with easier use */
export const BASE_URL = import.meta.env.VITE_APP_MAAS_URL;

type LogEntry = {
  testName: string;
  time: number;
  scope: string;
  message: string;
};

const logsByFile: Record<string, LogEntry[]> = {};
const testStart = performance.now();
const logFile = path.join(process.cwd(), "test-timings.log");

export function logEvent(
  file: string,
  testName: string,
  scope: string,
  message: string
) {
  if (!process.env.MEASURE_UNIT_PERFORMANCE) return;
  const now = performance.now() - testStart;

  if (!logsByFile[file]) {
    logsByFile[file] = [];
  }

  logsByFile[file].push({ testName, time: now, scope, message });
}

export function flushAllLogs() {
  if (!process.env.MEASURE_UNIT_PERFORMANCE) return;
  const lines: string[] = [];

  for (const [file, entries] of Object.entries(logsByFile)) {
    lines.push(`######## ${file} ########`);

    const groupedByTest: Record<string, LogEntry[]> = {};
    for (const entry of entries) {
      if (!groupedByTest[entry.testName]) {
        groupedByTest[entry.testName] = [];
      }
      groupedByTest[entry.testName].push(entry);
    }

    for (const [testName, testEntries] of Object.entries(groupedByTest)) {
      lines.push(`\n=== ${testName.split(">").at(-1)} ===`);
      for (const e of testEntries) {
        lines.push(`[+${e.time.toFixed(1)}ms] [${e.scope}] ${e.message}`);
      }
    }
  }
  lines.push("\n");

  fs.appendFileSync(logFile, lines.join("\n"), "utf-8");
}

/**
 * A function for setting up the MSW with the base testing url.
 *
 * Delegates to the upstreamed `setupMockServer` from
 * `@canonical/maas-react-components/testing`, wiring in the project's
 * Hey-API client/base URL and preserving request/response timing logs.
 *
 * @param handlers The destructured list of request handlers
 * @return The mock server instance
 */
export const setupMockServer = (...handlers: RequestHandler[]) => {
  const mockServer = libSetupMockServer(client, BASE_URL, ...handlers);

  mockServer.events.on("request:start", ({ request }: { request: Request }) => {
    logEvent(
      expect.getState().testPath?.split("/").pop() || "unknown file",
      expect.getState().currentTestName || "unknown",
      "request:start",
      `[msw] → Request: ${request.method} ${request.url}`
    );
  });

  mockServer.events.on("request:end", ({ request }: { request: Request }) => {
    logEvent(
      expect.getState().testPath?.split("/").pop() || "unknown file",
      expect.getState().currentTestName || "unknown",
      "request:end",
      `[msw] ← Response: ${request.method} ${request.url}`
    );
  });

  afterAll(() => {
    flushAllLogs();
  });

  return mockServer;
};

type MaasStore = MockStoreEnhanced<RootState | unknown>;

/**
 * Wraps rendered/hooked children with the app's WebSocketProvider and a
 * render Profiler used for perf logging, to be passed as
 * `AdditionalProviders` to the upstreamed render helpers.
 */
const AdditionalProviders = ({ children }: { children: ReactNode }) => {
  const onRender: ProfilerOnRenderCallback = (_id, phase, actualDuration) => {
    logEvent(
      expect.getState().testPath?.split("/").pop() || "unknown file",
      expect.getState().currentTestName || "unknown",
      "render",
      `[${phase}], took ${actualDuration.toFixed(2)}ms`
    );
  };

  return (
    <Profiler id="TestComponent" onRender={onRender}>
      <WebSocketProvider>{children}</WebSocketProvider>
    </Profiler>
  );
};

/**
 * A function for rendering a component with all test-relevant providers.
 *
 * Delegates to the upstreamed `renderWithProviders` from
 * `@canonical/maas-react-components/testing`, defaulting the store to a
 * `redux-mock-store` preloaded with `RootState` so that `store.getActions()`
 * remains available to callers.
 *
 * @param ui The component to be rendered
 * @param options The rendering options
 * @returns { result, router, rerender, store }
 */
export const renderWithProviders = (
  ui: ReactNode,
  options?: Omit<RenderOptions, "wrapper"> &
    Partial<{
      state: Partial<RootState>;
      store: MaasStore;
      initialEntries: InitialEntry[];
      pattern: string;
    }>
): {
  result: RenderResult;
  router: DataRouter;
  rerender: (ui: ReactNode, options?: { state?: RootState }) => void;
  store: MaasStore;
} => {
  const store: MaasStore =
    options?.store ??
    getMockStore({ ...factory.rootState(), ...options?.state });

  const {
    result,
    router,
    rerender,
    store: renderedStore,
  } = libRenderWithProviders<RootState>(ui, {
    ...options,
    store,
    AdditionalProviders,
  });

  return {
    result,
    router,
    rerender,
    store: renderedStore as MaasStore,
  };
};

/**
 * A function for rendering a hook with all test-relevant providers.
 *
 * Delegates to the upstreamed `renderHookWithProviders` from
 * `@canonical/maas-react-components/testing`, defaulting the store to a
 * `redux-mock-store` preloaded with `RootState`.
 *
 * @param hook The hook to be rendered
 * @param options
 * @returns { result, store, queryClient }
 */
export const renderHookWithProviders = <T,>(
  hook: () => T,
  options?: Partial<{
    state: Partial<RootState>;
    store: MaasStore;
    initialEntries: string[];
  }>
): {
  result: { current: T };
  store: MaasStore;
  queryClient: QueryClient;
} => {
  const store: MaasStore =
    options?.store ??
    getMockStore({ ...factory.rootState(), ...options?.state });

  const {
    result,
    store: renderedStore,
    queryClient,
  } = libRenderHookWithProviders<T, RootState>(hook, {
    ...options,
    store,
    AdditionalProviders,
  });

  return { result, store: renderedStore as MaasStore, queryClient };
};

export {
  expectTooltipOnHover,
  mockIsPending,
  mockSidePanel,
  spyOnMutation,
  waitForLoading,
};
