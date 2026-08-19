import fs from "fs";
import path from "path";

import type { ProfilerOnRenderCallback, ReactNode } from "react";
import { Profiler } from "react";

import {
  expectTooltipOnHover,
  mockIsPending,
  mockSidePanel,
  renderHookWithProviders as upstreamRenderHookWithProviders,
  renderWithProviders as upstreamRenderWithProviders,
  setupMockServer as upstreamSetupMockServer,
  spyOnMutation,
  waitForLoading,
} from "@canonical/maas-react-components/testing";
import type { QueryClient } from "@tanstack/react-query";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import type { RequestHandler } from "msw";
import { Provider } from "react-redux";
import type { DataRouter, InitialEntry } from "react-router";
import type { MockStoreEnhanced } from "redux-mock-store";
import configureStore from "redux-mock-store";
import { vi } from "vitest";

import { client } from "@/app/apiclient/client.gen";
import { WebSocketProvider } from "@/app/base/websocket-context";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";

const getMockStore = (state = factory.rootState()) => {
  const mockStore = configureStore();
  return mockStore(state);
};

const BASE_URL = import.meta.env.VITE_APP_MAAS_URL;

type LogEntry = {
  testName: string;
  time: number;
  scope: string;
  message: string;
};

const logsByFile: Record<string, LogEntry[]> = {};
const testStart = performance.now();
const logFile = path.join(process.cwd(), "test-timings.log");

function logEvent(
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

function flushAllLogs() {
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
const setupMockServer = (...handlers: RequestHandler[]) => {
  const mockServer = upstreamSetupMockServer(client, BASE_URL, ...handlers);

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
 * Builds a project-specific `AdditionalProviders` wrapper (Redux `Provider`,
 * `WebSocketProvider`, and a render `Profiler` used for perf logging) to be
 * passed to the upstreamed render helpers, which no longer maintain any
 * Redux/state-management dependencies themselves.
 *
 * `store` is read via a getter so that callers (e.g. `rerender`) can swap the
 * underlying store between renders while reusing the same component
 * reference.
 */
const makeAdditionalProviders = (getStore: () => MaasStore) => {
  return ({ children }: { children: ReactNode }) => {
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
        <WebSocketProvider>
          <Provider store={getStore()}>{children}</Provider>
        </WebSocketProvider>
      </Profiler>
    );
  };
};

/**
 * A function for rendering a component with all test-relevant providers.
 *
 * Delegates to the upstreamed `renderWithProviders` from
 * `@canonical/maas-react-components/testing`, which no longer owns any Redux
 * behavior, so the Redux `store`/`Provider` are supplied here via
 * `AdditionalProviders` and defaulted to a `redux-mock-store` preloaded with
 * `RootState` so that `store.getActions()` remains available to callers.
 *
 * @param ui The component to be rendered
 * @param options The rendering options
 * @returns { result, router, rerender, store }
 */
const renderWithProviders = (
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
  let store: MaasStore =
    options?.store ??
    getMockStore({ ...factory.rootState(), ...options?.state });

  const AdditionalProviders = makeAdditionalProviders(() => store);

  const {
    result,
    router,
    rerender: libRerender,
  } = upstreamRenderWithProviders(ui, {
    ...options,
    AdditionalProviders,
  });

  const rerender = (
    ui: ReactNode,
    { state: newState }: { state?: RootState } = {}
  ) => {
    if (newState) {
      store = getMockStore({ ...options?.state, ...newState });
    }
    return libRerender(ui);
  };

  return { result, router, rerender, store };
};

/**
 * A function for rendering a hook with all test-relevant providers.
 *
 * Delegates to the upstreamed `renderHookWithProviders` from
 * `@canonical/maas-react-components/testing`, which no longer owns any Redux
 * behavior, so the Redux `store`/`Provider` are supplied here via
 * `AdditionalProviders` and defaulted to a `redux-mock-store` preloaded with
 * `RootState`.
 *
 * @param hook The hook to be rendered
 * @param options
 * @returns { result, store, queryClient }
 */
const renderHookWithProviders = <T,>(
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

  const AdditionalProviders = makeAdditionalProviders(() => store);

  const { result, queryClient } = upstreamRenderHookWithProviders<T>(hook, {
    ...options,
    AdditionalProviders,
  });

  return { result, store, queryClient };
};

const waitFor = vi.waitFor;

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

export {
  expectTooltipOnHover,
  mockIsPending,
  mockSidePanel,
  spyOnMutation,
  waitForLoading,
  BASE_URL,
  setupMockServer,
  renderWithProviders,
  renderHookWithProviders,
  waitFor,
};
