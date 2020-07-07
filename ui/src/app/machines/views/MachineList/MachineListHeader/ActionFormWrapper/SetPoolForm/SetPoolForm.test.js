import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import SetPoolForm from "./SetPoolForm";

const mockStore = configureStore();

describe("SetPoolForm", () => {
  let state;
  beforeEach(() => {
    state = {
      general: {
        machineActions: {
          data: [{ name: "set-pool", sentence: "change those pools" }],
        },
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
          },
          {
            system_id: "def456",
          },
        ],
        selected: [],
        statuses: {
          abc123: { settingPool: false },
          def456: { settingPool: false },
        },
      },
      resourcepool: {
        errors: {},
        items: [
          { id: 0, name: "default" },
          { id: 1, name: "pool-1" },
        ],
      },
    };
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
    expect(store.getActions()).toStrictEqual([
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
});
