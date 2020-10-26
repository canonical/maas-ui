import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import SetPoolForm from "./SetPoolForm";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  generalState as generalStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SetPoolForm", () => {
  let state;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        machineActions: {
          data: [{ name: "set-pool", sentence: "change those pools" }],
        },
      }),
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
          abc123: { settingPool: false },
          def456: { settingPool: false },
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
          <SetPoolForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "resourcepool/fetch")
    ).toBe(true);
  });

  it("correctly dispatches actions to set pools of selected machines", () => {
    const store = mockStore(state);
    state.machine.selected = ["abc123", "def456"];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetPoolForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        poolSelection: "select",
        name: "pool-1",
        description: "",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "SET_MACHINE_POOL")
    ).toStrictEqual([
      {
        type: "SET_MACHINE_POOL",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "set-pool",
            extra: {
              pool_id: 1,
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "SET_MACHINE_POOL",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "set-pool",
            extra: {
              pool_id: 1,
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("correctly dispatches action to set machine pool from details view", () => {
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <SetPoolForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        poolSelection: "select",
        name: "pool-1",
        description: "",
      })
    );

    expect(
      store.getActions().filter((action) => action.type === "SET_MACHINE_POOL")
    ).toStrictEqual([
      {
        type: "SET_MACHINE_POOL",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "set-pool",
            extra: {
              pool_id: 1,
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });
});
