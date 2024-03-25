import type { ReactNode } from "react";

import type { ValueOf } from "@canonical/react-components";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { render, screen, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter, CompatRouter, Route, Routes } from "react-router-dom";
import type { MockStoreEnhanced } from "redux-mock-store";
import configureStore from "redux-mock-store";

import type {
  SidePanelContent,
  SidePanelSize,
} from "@/app/base/side-panel-context";
import SidePanelContextProvider from "@/app/base/side-panel-context";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
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
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "@/testing/factories";

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

type WrapperProps = {
  parentRoute?: string;
  routePattern?: string;
  state?: RootState;
  store?: MockStoreEnhanced<RootState | unknown, {}>;
  sidePanelContent?: SidePanelContent;
  sidePanelSize?: SidePanelSize;
};

export const BrowserRouterWithProvider = ({
  children,
  parentRoute,
  routePattern,
  sidePanelContent,
  sidePanelSize,
  state,
  store,
}: WrapperProps & { children: React.ReactNode }): React.ReactNode => {
  const getMockStore = (state: RootState) => {
    const mockStore = configureStore();
    return mockStore(state);
  };

  const route = <Route element={children} path={routePattern} />;
  return (
    <Provider store={store ?? getMockStore(state || rootStateFactory())}>
      <SidePanelContextProvider
        initialSidePanelContent={sidePanelContent}
        initialSidePanelSize={sidePanelSize}
      >
        <BrowserRouter>
          <CompatRouter>
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
          </CompatRouter>
        </BrowserRouter>
      </SidePanelContextProvider>
    </Provider>
  );
};

const WithMockStoreProvider = ({
  children,
  state,
  store,
}: WrapperProps & { children: React.ReactNode }) => {
  const getMockStore = (state: RootState) => {
    const mockStore = configureStore();
    return mockStore(state);
  };
  return (
    <Provider store={store ?? getMockStore(state || rootStateFactory())}>
      <SidePanelContextProvider>{children}</SidePanelContextProvider>
    </Provider>
  );
};

export const renderWithBrowserRouter = (
  ui: React.ReactElement,
  options?: RenderOptions &
    WrapperProps & {
      route?: string;
    }
): RenderResult => {
  const { route, ...wrapperProps } = options || {};
  window.history.pushState({}, "", route);

  const rendered = render(ui, {
    wrapper: (props) => (
      <BrowserRouterWithProvider {...props} {...wrapperProps} />
    ),
    ...options,
  });

  return {
    ...rendered,
  };
};

export const renderWithMockStore = (
  ui: React.ReactNode,
  options?: RenderOptions & {
    state?: RootState;
    store?: WrapperProps["store"];
  }
): RenderResult => {
  const { state, store, ...renderOptions } = options ?? {};
  const rendered = render(ui, {
    wrapper: (props) => (
      <WithMockStoreProvider {...props} state={state} store={store} />
    ),
    ...renderOptions,
  });
  return {
    ...rendered,
    rerender: (ui: React.ReactNode) =>
      renderWithMockStore(ui, { container: rendered.container, ...options }),
  };
};

export const getUrlParam: URLSearchParams["get"] = (param: string) =>
  new URLSearchParams(window.location.search).get(param);

// Complete initial test state with all data loaded and no errors
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
    resourcepool: resourcePoolStateFactory({
      loaded: true,
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
    zone: zoneStateFactory({
      genericActions: zoneGenericActionsFactory({ fetch: "success" }),
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

  const pass =
    screen.getAllByRole("tooltip", { name: tooltipText }).length === 1;

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

const generateWrapper =
  (store = configureStore()(rootStateFactory())) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

type Hook = Parameters<typeof renderHook>[0];
export const renderHookWithMockStore = (hook: Hook) => {
  return renderHook(hook, { wrapper: generateWrapper() });
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
