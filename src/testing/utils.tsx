import type { ReactNode } from "react";

import type { ValueOf } from "@canonical/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { render, screen, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MemoryHistory, MemoryHistoryOptions } from "history";
import { createMemoryHistory } from "history";
import { produce } from "immer";
import type { HttpHandler, RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import type { DataRouter, InitialEntry } from "react-router";
import {
  BrowserRouter,
  createMemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router";
import { HistoryRouter } from "redux-first-history/rr6";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import type { QueryModel } from "@/app/api/query-client";
import type {
  BadRequestBodyResponse,
  ConflictBodyResponse,
  NotFoundBodyResponse,
  UnauthorizedBodyResponse,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";
import { client } from "@/app/apiclient/client.gen";
import type {
  SidePanelContent,
  SidePanelSize,
} from "@/app/base/side-panel-context";
import SidePanelContextProvider from "@/app/base/side-panel-context";
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

export type InitialData = Partial<Record<QueryModel, unknown>>;

export const setupQueryClient = (queryData?: InitialData) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  if (queryData) {
    Object.entries(queryData).forEach(([key, value]) => {
      queryClient.setQueryData([key], value);
    });
  }

  return queryClient;
};

export const setupInitialData = (queryData?: InitialData) =>
  queryData ?? createInitialData();

export const createInitialData = (): InitialData => ({
  zones: [],
});

/**
 * Replace objects in an array with objects that have new values, given a match
 * criteria.
 * @param {Array} array - Array to be reduced.
 * @param {String} key - Object key to compare the match criteria e.g. "name".
 * @param {String} match - Match criteria e.g. "Bob".
 * @param {Object} newValues - Values to insert or update in the object.
 * @returns {Array} The reduced array.
 */
export const reduceInitialState = <I,>(
  array: I[],
  key: keyof I,
  match: ValueOf<I>,
  newValues: Partial<I>
): I[] => {
  return array.reduce<I[]>((acc, item) => {
    if (item[key] === match) {
      acc.push({
        ...item,
        ...newValues,
      });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};

/**
 * A matcher function to find elements by text that is broken up by multiple child elements
 * @param {string | RegExp} text The text content that you are looking for
 * @returns {HTMLElement} An element matching the text provided
 */
export const getByTextContent = (text: string | RegExp): HTMLElement => {
  return screen.getByText((_, element) => {
    const hasText = (element: Element | null) => {
      if (element) {
        if (text instanceof RegExp && element.textContent) {
          return text.test(element.textContent);
        } else {
          return element.textContent === text;
        }
      } else {
        return false;
      }
    };
    const elementHasText = hasText(element);
    const childrenDontHaveText = Array.from(element?.children || []).every(
      (child) => !hasText(child)
    );
    return elementHasText && childrenDontHaveText;
  });
};

interface WrapperProps {
  parentRoute?: string;
  routePattern?: string;
  state?: RootState;
  store?: MockStoreEnhanced<RootState | unknown, object>;
  queryData?: InitialData;
  sidePanelContent?: SidePanelContent;
  sidePanelSize?: SidePanelSize;
}

export const BrowserRouterWithProvider = ({
  children,
  queryData,
  parentRoute,
  routePattern,
  sidePanelContent,
  sidePanelSize,
  store,
}: WrapperProps & { children: React.ReactNode }): React.ReactNode => {
  const route = <Route element={children} path={routePattern} />;
  return (
    <QueryClientProvider client={setupQueryClient(queryData)}>
      <WebSocketProvider>
        <Provider store={store ?? getMockStore()}>
          <SidePanelContextProvider
            initialSidePanelContent={sidePanelContent}
            initialSidePanelSize={sidePanelSize}
          >
            <BrowserRouter>
              {routePattern ? (
                <Routes>
                  {parentRoute ? (
                    <Route path={parentRoute}>{route}</Route>
                  ) : (
                    route
                  )}
                </Routes>
              ) : (
                children
              )}
            </BrowserRouter>
          </SidePanelContextProvider>
        </Provider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
};

const WithMockStoreProvider = ({
  children,
  state,
  store,
}: WrapperProps & { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={setupQueryClient()}>
      <Provider store={store ?? getMockStore(state || rootStateFactory())}>
        <SidePanelContextProvider>{children}</SidePanelContextProvider>
      </Provider>
    </QueryClientProvider>
  );
};

interface EnhancedRenderResult extends RenderResult {
  store: MockStoreEnhanced<RootState | unknown, object>;
}

export interface WithRouterOptions extends RenderOptions, WrapperProps {
  route?: string;
  queryData?: Record<string, unknown>;
}

const getMockStore = (state = factory.rootState()) => {
  const mockStore = configureStore();
  return mockStore(state);
};

export const renderWithBrowserRouter = (
  ui: React.ReactNode,
  options?: WithRouterOptions
) => {
  const {
    queryData = setupInitialData(),
    state = rootStateFactory(),
    route = "/",
    ...renderOptions
  } = options || {};
  let store = getMockStore(state);

  window.history.pushState({}, "Test page", route);

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouterWithProvider
        queryData={queryData}
        store={store}
        {...renderOptions}
      >
        {children}
      </BrowserRouterWithProvider>
    );
  };

  const rendered = render(ui, { wrapper: Wrapper, ...renderOptions });

  const customRerender = (
    ui: React.ReactNode,
    { state: newState }: { state?: WrapperProps["state"] } = {}
  ) => {
    if (newState) {
      store = getMockStore({ ...state, ...newState });
    }
    return render(ui, {
      container: rendered.container,
      wrapper: Wrapper,
      ...renderOptions,
    });
  };
  return {
    store,
    ...rendered,
    rerender: customRerender,
  };
};

interface WithStoreRenderOptions extends RenderOptions {
  state?: RootState | ((stateDraft: RootState) => void);
  store?: WrapperProps["store"];
  queryData?: WrapperProps["queryData"];
}

export const renderWithMockStore = (
  ui: React.ReactNode,
  options?: WithStoreRenderOptions
): Omit<RenderResult, "rerender"> & {
  rerender: (ui: React.ReactNode, newOptions?: WithStoreRenderOptions) => void;
} => {
  const { state, store, queryData, ...renderOptions } = options ?? {};
  const initialState =
    typeof state === "function"
      ? produce(rootStateFactory(), state)
      : state || rootStateFactory();

  const initialData = setupInitialData(queryData);
  const queryClient = setupQueryClient(initialData);

  const rendered = render(ui, {
    wrapper: (props) => (
      <WebSocketProvider>
        <QueryClientProvider client={queryClient}>
          <WithMockStoreProvider
            {...props}
            queryData={initialData}
            state={initialState}
            store={store ?? getMockStore(initialState)}
          />
        </QueryClientProvider>
      </WebSocketProvider>
    ),
    ...renderOptions,
  });
  return {
    ...rendered,
    rerender: (ui: React.ReactNode, newOptions?: WithStoreRenderOptions) =>
      renderWithMockStore(ui, {
        container: rendered.container,
        ...options,
        ...newOptions,
        state:
          state && typeof newOptions?.state === "function"
            ? produce(state, newOptions.state)
            : newOptions?.state || state,
        queryData: newOptions?.queryData || queryData,
      }),
  };
};

export const getUrlParam: URLSearchParams["get"] = (param: string) =>
  new URLSearchParams(window.location.search).get(param);

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

export const expectTooltipOnHover = async (
  element: Element | null,
  tooltipText: string | RegExp
) => {
  expect(
    screen.queryByRole("tooltip", { name: tooltipText })
  ).not.toBeInTheDocument();

  if (!element) {
    return {
      message: () => `expected the element to exist`,
      pass: false,
    };
  }

  await userEvent.hover(element);

  if (element.querySelector("i")) {
    await userEvent.hover(element.querySelector("i")!);
  }

  const pass = await vi.waitFor(
    () => screen.getAllByRole("tooltip", { name: tooltipText }).length === 1
  );

  if (pass) {
    return {
      message: () =>
        `expected the element not to have tooltip '${tooltipText}'`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected the element to have tooltip '${tooltipText}'`,
      pass: false,
    };
  }
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
  screen,
  render,
  renderHook,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

interface WithHistoryRouterOptions
  extends RenderOptions,
    WrapperProps,
    MemoryHistoryOptions {
  history?: MemoryHistory;
}

export const renderWithHistoryRouter = (
  ui: React.ReactElement,
  options?: WithHistoryRouterOptions
): EnhancedRenderResult & { history: MemoryHistory } => {
  const {
    state,
    store: initialStore,
    initialEntries,
    ...renderOptions
  } = options || {};
  const history = options?.history || createMemoryHistory({ initialEntries });

  const getMockStore = (state: RootState) => {
    const mockStore = configureStore();
    return mockStore(state);
  };
  const store = initialStore ?? getMockStore(state || rootStateFactory());

  const rendered = render(
    <QueryClientProvider client={setupQueryClient()}>
      <WebSocketProvider>
        <Provider store={store}>
          <HistoryRouter history={history}>{ui}</HistoryRouter>
        </Provider>
      </WebSocketProvider>
    </QueryClientProvider>,
    renderOptions
  );

  return {
    ...rendered,
    store,
    history,
  };
};

/* New utils with easier use */
export const BASE_URL = import.meta.env.VITE_APP_MAAS_URL;

/**
 * A function for setting up the MSW with the base testing url.
 *
 * @param handlers The destructured list of request handlers
 * @return The mock server instance
 */
export const setupMockServer = (...handlers: RequestHandler[]) => {
  client.setConfig({ baseUrl: BASE_URL });

  const mockServer = setupServer(...handlers);

  beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));
  afterEach(() => {
    mockServer.resetHandlers();
  });
  afterAll(() => mockServer.close());

  return mockServer;
};

/**
 * A function for rendering a component with all test-relevant providers.
 *
 * @param ui The component to be rendered
 * @param options The rendering options
 * @returns { result, router, store }
 */
export const renderWithProviders = (
  ui: ReactNode,
  options?: Omit<RenderOptions, "wrapper"> &
    Partial<{
      state?: Partial<RootState>;
      store?: MockStoreEnhanced<RootState | unknown>;
      initialEntries?: InitialEntry[];
    }>
): {
  result: RenderResult;
  router: DataRouter;
  store: MockStoreEnhanced<RootState | unknown>;
} => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: <SidePanelContextProvider>{ui}</SidePanelContextProvider>,
      },
    ],
    { initialEntries: options?.initialEntries || ["/"] }
  );

  const store =
    options?.store ??
    configureStore()({
      ...factory.rootState(),
      ...options?.state,
    });

  return {
    result: render(
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
        </WebSocketProvider>
      </QueryClientProvider>,
      options
    ),
    router,
    store,
  };
};

/**
 * A function for rendering a hook with all test-relevant providers.
 *
 * @param hook The hook to be rendered
 * @param options
 * @returns { rerender, result, unmount, store }
 */
export const renderHookWithProviders = <T,>(
  hook: () => T,
  options?: Partial<{
    state: Partial<RootState>;
    store: MockStoreEnhanced<RootState | unknown>;
    initialEntries: string[];
  }>
): {
  result: { current: T };
  store: MockStoreEnhanced<RootState | unknown>;
} => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const store =
    options?.store ??
    configureStore()({
      ...factory.rootState(),
      ...options?.state,
    });

  return {
    result: renderHook(hook, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <WebSocketProvider>
            <Provider store={store}>{children}</Provider>
          </WebSocketProvider>
        </QueryClientProvider>
      ),
    }).result,
    store,
  };
};

/**
 * Mocks the useQuery hook to return a pending state.
 */
export const mockIsPending = () => {
  vi.doMock("@tanstack/react-query", async () => {
    const actual: object = await vi.importActual("@tanstack/react-query");
    return {
      ...actual,
      useQuery: vi.fn().mockReturnValueOnce({
        data: null,
        isPending: true,
        failureReason: undefined,
        isFetched: false,
      }),
    };
  });

  afterEach(() => {
    vi.doUnmock("@tanstack/react-query");
  });
};

/**
 * Waits until the loading text is no longer present in the document.
 *
 * @param loadingText The text to query for. Defaults to "Loading".
 */
export const waitForLoading = async (loadingText = "Loading") =>
  await waitFor(() =>
    expect(
      screen.queryByText(new RegExp(loadingText, "i"))
    ).not.toBeInTheDocument()
  );

/**
 * Resolver type for MSW testing resolvers
 */
export interface Resolver<T, E> {
  [key: string]: {
    resolved: boolean;
    handler: (
      data?:
        | T
        | {
            items: Array<T>;
            total: number;
            next?: string;
            kind?: string;
          }
    ) => HttpHandler;
    error: (error: E) => HttpHandler;
  };
}

/**
 * Base errors to be used for Resolver default error returns
 */
export const mockErrors = {
  listError: {
    message: "Unauthorized",
    code: 401,
    kind: "Error",
  } as UnauthorizedBodyResponse | ValidationErrorBodyResponse,
  getError: {
    message: "Not found",
    code: 404,
    kind: "Error",
  } as NotFoundBodyResponse | ValidationErrorBodyResponse,
  createError: {
    message: "Already exists",
    code: 409,
    kind: "Error",
  } as ConflictBodyResponse | ValidationErrorBodyResponse,
  updateError: {
    message: "Invalid",
    code: 422,
    kind: "Error",
  } as NotFoundBodyResponse | ValidationErrorBodyResponse,
  deleteError: {
    message: "Bad request",
    code: 400,
    kind: "Error",
  } as
    | BadRequestBodyResponse
    | NotFoundBodyResponse
    | ValidationErrorBodyResponse,
};
