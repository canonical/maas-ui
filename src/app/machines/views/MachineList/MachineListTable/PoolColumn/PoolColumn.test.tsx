import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { PoolColumn } from "./PoolColumn";

import DoubleRow from "app/base/components/DoubleRow";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("PoolColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            pool: modelRefFactory({ id: 0, name: "default" }),
            description: "Firmware old",
            actions: [NodeActions.SET_POOL],
          }),
        ],
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({
            id: 0,
            name: "default",
          }),
          resourcePoolFactory({
            id: 1,
            name: "Backup",
          }),
        ],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      {
        route: "/machines",
        store: store,
      }
    );

    expect(screen.getByTestId("pool-column")).toMatchSnapshot();
  });

  it("displays pool", () => {
    state.machine.items[0].pool = modelRefFactory({ name: "pool-1" });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
      </Provider>,
      {
        route: "/machines",
      }
    );

    expect(screen.getByTestId("pool")).toHaveTextContent("pool-1");
  });

  it("displays description", () => {
    state.machine.items[0].description = "decomissioned";
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
      </Provider>,
      {
        route: "/machines",
      }
    );

    expect(screen.getByTestId("note")).toHaveTextContent("decomissioned");
  });

  it("displays a message if there are no additional pools", () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "default",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
      </Provider>,
      {
        route: "/machines",
      }
    );
    const items = screen.getByTestId("menu-links");
    expect(items?.children?.length).toBe(1);
    expect(items && items.children[0]).toHaveAttribute("disabled");
  });

  it("displays a message if the machine cannot have its pool changed", () => {
    state.machine.items[0].actions = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
      </Provider>,
      {
        route: "/machines",
      }
    );
    const items = screen.getByTestId("menu-links");
    expect(items?.children?.length).toBe(1);
    expect(items && items.children[0]).toHaveAttribute("disabled");
  });

  it("can change pools", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
      </Provider>,
      {
        route: "/machines",
      }
    );
    // Open the menu.
    act(() => {
      screen.getByRole("button").click();
      screen.getByText(/Backup/i).click();
    });
    expect(
      store.getActions().find((action) => action.type === "machine/setPool")
    ).toEqual({
      type: "machine/setPool",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.SET_POOL,
          extra: {
            pool_id: 1,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("shows a spinner when changing pools", () => {
    state.machine.actions = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
      </Provider>,
      {
        route: "/machines",
      }
    );
    expect(screen.queryByText(/loading/i)).toBeNull();
    // Open the menu.
    act(() => {
      screen.getByRole("button").click();
      screen.getByText(/Backup/i).click();
    });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <PoolColumn systemId="abc123" />
      </Provider>,
      {
        route: "/machines",
      }
    );

    expect(screen.queryByTestId("table-menu")).toBeNull();
  });
});
