import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import AddMachineForm from "./AddMachineForm";

const mockStore = configureStore();

describe("AddMachine", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [{ name: "maas_name", value: "MAAS" }],
      },
      domain: {
        items: [
          {
            id: 0,
            name: "maas",
          },
        ],
        loaded: true,
      },
      general: {
        architectures: {
          data: ["amd64/generic"],
          loaded: true,
        },
        defaultMinHweKernel: {
          data: "ga-16.04",
          loaded: true,
        },
        hweKernels: {
          data: [
            ["ga-16.04", "xenial (ga-16.04)"],
            ["ga-18.04", "bionic (ga-18.04)"],
          ],
          loaded: true,
        },
        powerTypes: {
          data: [
            {
              name: "manual",
              description: "Manual",
              fields: [],
            },
            {
              name: "dummy",
              description: "Dummy power type",
              fields: [
                {
                  name: "power_address",
                  label: "IP address",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
              ],
            },
          ],
          loaded: true,
        },
      },
      machine: {
        errors: {},
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

  it("fetches the necessary data on load if not already loaded", () => {
    const state = { ...initialState };
    state.resourcepool.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "FETCH_DOMAIN",
      "FETCH_GENERAL_ARCHITECTURES",
      "FETCH_GENERAL_DEFAULT_MIN_HWE_KERNEL",
      "FETCH_GENERAL_HWE_KERNELS",
      "FETCH_GENERAL_POWER_TYPES",
      "FETCH_RESOURCEPOOL",
      "FETCH_ZONE",
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
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").length).toBe(1);
  });

  it("can handle saving a machine", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        architecture: "amd64/generic",
        domain: "maas",
        extra_macs: [],
        hostname: "machine",
        min_hwe_kernel: "ga-16.04",
        pool: "default",
        power_parameters: {},
        power_type: "manual",
        pxe_mac: "11:11:11:11:11:11",
        zone: "default",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "CREATE_MACHINE")
    ).toStrictEqual({
      type: "CREATE_MACHINE",
      meta: {
        method: "create",
        model: "machine",
      },
      payload: {
        params: {
          architecture: "amd64/generic",
          domain: state.domain.items[0],
          extra_macs: [],
          hostname: "machine",
          min_hwe_kernel: "ga-16.04",
          pool: state.resourcepool.items[0],
          power_parameters: {},
          power_type: "manual",
          pxe_mac: "11:11:11:11:11:11",
          zone: state.zone.items[0],
        },
      },
    });
  });

  it("correctly trims power parameters before dispatching action", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );

    const powerTypes = wrapper.find("select[name='power_type']");

    // Select the dummy power type from the dropdown, which only has one param.
    await act(async () => {
      powerTypes
        .props()
        .onChange({ target: { name: "power_type", value: "dummy" } });
    });
    wrapper.update();

    // Submit the form with an extra power parameter, power_id.
    await act(async () =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          architecture: "amd64/generic",
          domain: "maas",
          extra_macs: [],
          hostname: "machine",
          min_hwe_kernel: "ga-16.04",
          pool: "default",
          power_parameters: { power_address: "192.168.1.1", power_id: "1" },
          power_type: "dummy",
          pxe_mac: "11:11:11:11:11:11",
          zone: "default",
        })
    );

    // Expect the power_id param to be removed when action is dispatched.
    expect(
      store.getActions().find((action) => action.type === "CREATE_MACHINE")
    ).toStrictEqual({
      type: "CREATE_MACHINE",
      meta: {
        method: "create",
        model: "machine",
      },
      payload: {
        params: {
          architecture: "amd64/generic",
          domain: state.domain.items[0],
          extra_macs: [],
          hostname: "machine",
          min_hwe_kernel: "ga-16.04",
          pool: state.resourcepool.items[0],
          power_parameters: { power_address: "192.168.1.1" },
          power_type: "dummy",
          pxe_mac: "11:11:11:11:11:11",
          zone: state.zone.items[0],
        },
      },
    });
  });

  it("correctly filters empty extra mac fields", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );

    // Submit the form with two extra macs, where one is an empty string
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          architecture: "amd64/generic",
          domain: "maas",
          extra_macs: ["12:12:12:12:12:12", ""],
          hostname: "machine",
          min_hwe_kernel: "ga-16.04",
          pool: "default",
          power_parameters: {},
          power_type: "dummy",
          pxe_mac: "11:11:11:11:11:11",
          zone: "default",
        })
    );

    // Expect the empty extra mac to be filtered out
    expect(
      store.getActions().find((action) => action.type === "CREATE_MACHINE")
    ).toStrictEqual({
      type: "CREATE_MACHINE",
      meta: {
        method: "create",
        model: "machine",
      },
      payload: {
        params: {
          architecture: "amd64/generic",
          domain: state.domain.items[0],
          extra_macs: ["12:12:12:12:12:12"],
          hostname: "machine",
          min_hwe_kernel: "ga-16.04",
          pool: state.resourcepool.items[0],
          power_parameters: {},
          power_type: "dummy",
          pxe_mac: "11:11:11:11:11:11",
          zone: state.zone.items[0],
        },
      },
    });
  });
});
