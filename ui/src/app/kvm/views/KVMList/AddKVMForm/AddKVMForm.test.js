import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import AddKVMForm from "./AddKVMForm";

const mockStore = configureStore();

describe("AddKVMForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [{ name: "maas_name", value: "MAAS" }],
      },
      general: {
        powerTypes: {
          data: [
            {
              driver_type: "pod",
              name: "lxd",
              description: "LXD (virtual systems)",
              fields: [
                {
                  name: "power_address",
                  label: "LXD address",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
                {
                  name: "instance_name",
                  label: "Instance name",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "node",
                },
                {
                  name: "password",
                  label: "LXD password (optional)",
                  required: false,
                  field_type: "password",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
              ],
              missing_packages: [],
              chassis: true,
              queryable: true,
              defaults: {
                cores: 1,
                memory: 2048,
                storage: 8,
              },
            },
            {
              name: "virsh",
              description: "Virsh (virtual systems)",
              fields: [
                {
                  name: "power_address",
                  label: "Address",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
                {
                  name: "power_pass",
                  label: "Password (optional)",
                  required: false,
                  field_type: "password",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
                {
                  name: "power_id",
                  label: "Virsh VM ID",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "node",
                },
              ],
              chassis: true,
            },
          ],
          loaded: true,
        },
      },
      pod: {
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      },
      resourcepool: {
        items: [
          {
            id: 0,
            name: "default",
          },
        ],
        loaded: true,
      },
      zone: {
        items: [
          {
            id: 0,
            name: "default",
          },
        ],
        loaded: true,
      },
    };
  });

  it("fetches the necessary data on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/rsd/add", key: "testKey" }]}
        >
          <AddKVMForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "FETCH_GENERAL_POWER_TYPES",
      "resourcepool/fetch",
      "zone/fetch",
    ];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.resourcepool.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/rsd/add", key: "testKey" }]}
        >
          <AddKVMForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("can handle saving a KVM", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/rsd/add", key: "testKey" }]}
        >
          <AddKVMForm />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").invoke("onSubmit")({
        name: "my-favourite-kvm",
        pool: 0,
        // power_parameters should be flattened before being sent through the websocket
        power_parameters: {
          power_address: "192.68.1.1",
          power_pass: "password",
        },
        type: "virsh",
        zone: 0,
      })
    );

    expect(
      store.getActions().find((action) => action.type === "pod/create")
    ).toStrictEqual({
      type: "pod/create",
      meta: {
        method: "create",
        model: "pod",
      },
      payload: {
        params: {
          name: "my-favourite-kvm",
          pool: 0,
          power_address: "192.68.1.1",
          power_pass: "password",
          type: "virsh",
          zone: 0,
        },
      },
    });
  });
});
