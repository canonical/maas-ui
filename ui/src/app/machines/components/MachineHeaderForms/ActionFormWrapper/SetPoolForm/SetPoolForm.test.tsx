import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SetPoolForm from "./SetPoolForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("SetPoolForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
          }),
          machineFactory({
            system_id: "def456",
          }),
        ],
        selected: [],
        statuses: {
          abc123: machineStatusFactory({ settingPool: false }),
          def456: machineStatusFactory({ settingPool: false }),
        },
      }),
      resourcepool: resourcePoolStateFactory({
        errors: {},
        items: [
          resourcePoolFactory({ id: 0, name: "default" }),
          resourcePoolFactory({ id: 1, name: "pool-1" }),
        ],
        loaded: true,
      }),
    });
  });

  it("dispatches action to fetch pools on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetPoolForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "resourcepool/fetch")
    ).toBe(true);
  });

  it("correctly dispatches actions to set pools of given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetPoolForm
            clearHeaderContent={jest.fn()}
            machines={state.machine.items}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        poolSelection: "select",
        name: "pool-1",
        description: "",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/setPool")
    ).toStrictEqual([
      {
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
      },
      {
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
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("correctly dispatches action to create and set pool of given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetPoolForm
            clearHeaderContent={jest.fn()}
            machines={state.machine.items}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        poolSelection: "create",
        name: "pool-1",
        description: "",
      })
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "resourcepool/createWithMachines")
    ).toStrictEqual({
      type: "resourcepool/createWithMachines",
      payload: {
        params: {
          machineIDs: ["abc123", "def456"],
          pool: {
            description: "",
            name: "pool-1",
            poolSelection: "create",
          },
        },
      },
    });
  });
});
