import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import SetZoneForm from "./SetZoneForm";

const mockStore = configureStore();

describe("SetZoneForm", () => {
  let state;
  beforeEach(() => {
    state = {
      general: {
        machineActions: {
          data: [{ name: "set-zone", sentence: "set-zone" }],
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
          abc123: {},
          def456: {},
        },
      },
      zone: {
        items: [
          { id: 0, name: "default" },
          { id: 1, name: "zone-1" },
        ],
      },
    };
  });

  it("correctly dispatches actions to set zones of selected machines", () => {
    const store = mockStore(state);
    state.machine.selected = ["abc123", "def456"];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetZoneForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        zone: "zone-1",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "SET_MACHINE_ZONE")
    ).toStrictEqual([
      {
        type: "SET_MACHINE_ZONE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "set-zone",
            extra: {
              zone_id: 1,
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "SET_MACHINE_ZONE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "set-zone",
            extra: {
              zone_id: 1,
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("can show the status when processing machines", () => {
    const store = mockStore(state);
    state.machine.selected = ["abc123", "def456"];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetZoneForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        zone: "zone-1",
      })
    );
    wrapper.update();
    expect(wrapper.find("MachinesProcessing").exists()).toBe(true);
  });
});
