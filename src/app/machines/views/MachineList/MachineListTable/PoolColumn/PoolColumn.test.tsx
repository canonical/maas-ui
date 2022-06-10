import { mount } from "enzyme";
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("PoolColumn")).toMatchSnapshot();
  });

  it("displays pool", () => {
    state.machine.items[0].pool = modelRefFactory({ name: "pool-1" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="pool"]').text()).toEqual("pool-1");
  });

  it("displays description", () => {
    state.machine.items[0].description = "decomissioned";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="note"]').text()).toEqual(
      "decomissioned"
    );
  });

  it("displays a message if there are no additional pools", () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "default",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const items = wrapper.find(DoubleRow).prop("menuLinks");
    expect(items?.length).toBe(1);
    expect(items && items[0]).toStrictEqual({
      children: "No other pools available",
      disabled: true,
    });
  });

  it("displays a message if the machine cannot have its pool changed", () => {
    state.machine.items[0].actions = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const items = wrapper.find(DoubleRow).prop("menuLinks");
    expect(items?.length).toBe(1);
    expect(items && items[0]).toStrictEqual({
      children: "Cannot change pool of this machine",
      disabled: true,
    });
  });

  it("can change pools", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Open the menu.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    act(() => {
      wrapper.find("[data-testid='change-pool-link']").at(0).simulate("click");
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(false);
    // Open the menu.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    act(() => {
      wrapper.find("[data-testid='change-pool-link']").at(0).simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolColumn systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableMenu").exists()).toBe(false);
  });
});
