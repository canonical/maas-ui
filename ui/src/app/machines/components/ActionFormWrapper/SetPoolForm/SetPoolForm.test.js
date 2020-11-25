import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import SetPoolForm from "./SetPoolForm";
import {
  machine as machineFactory,
  machineAction as machineActionFactory,
  machineActionsState as machineActionsStateFactory,
  machineState as machineStateFactory,
  generalState as generalStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import { NodeActions } from "app/store/types/node";

const mockStore = configureStore();

describe("SetPoolForm", () => {
  let state;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [
            machineActionFactory({
              name: NodeActions.SET_POOL,
              sentence: "change those pools",
              title: "Set pool",
            }),
          ],
        }),
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

  it("correctly dispatches action to set machine pool from details view", () => {
    state.machine.active = "abc123";
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
    ]);
  });
});
