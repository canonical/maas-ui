import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import AddMachineForm from "../AddMachineForm";

const mockStore = configureStore();

describe("AddMachineFormFields", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [{ name: "maas_name", value: "MAAS" }]
      },
      domain: {
        items: [
          {
            id: 0,
            name: "maas"
          }
        ],
        loaded: true
      },
      general: {
        architectures: {
          data: ["amd64/generic"],
          loaded: true
        },
        defaultMinHweKernel: {
          data: "ga-16.04",
          loaded: true
        },
        hweKernels: {
          data: [
            ["ga-16.04", "xenial (ga-16.04)"],
            ["ga-18.04", "bionic (ga-18.04)"]
          ],
          loaded: true
        },
        powerTypes: {
          data: [
            {
              name: "manual",
              description: "Manual",
              fields: []
            }
          ],
          loaded: true
        }
      },
      machine: {
        saved: false,
        saving: false
      },
      resourcepool: {
        items: [
          {
            id: 0,
            name: "default"
          }
        ],
        loaded: true
      },
      zone: {
        items: [
          {
            id: 0,
            name: "default"
          }
        ],
        loaded: true
      }
    };
  });

  it("correctly sets minimum kernel to default", () => {
    const state = { ...initialState };
    state.general.defaultMinHweKernel.data = "ga-18.04";
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
    expect(wrapper.find("Select[name='min_hwe_kernel']").props().value).toBe(
      "ga-18.04"
    );
  });

  it("correctly generates power options from power type", async () => {
    const state = { ...initialState };
    state.general.powerTypes.data = [
      {
        name: "fake_power_type",
        description: "This is not real",
        fields: [
          {
            name: "field1",
            label: "Required text",
            required: true
          },
          {
            name: "field2",
            label: "Non-required text",
            required: false
          },
          {
            name: "field3",
            label: "Select with choices",
            field_type: "choice",
            choices: [
              ["choice1", "Choice 1"],
              ["choice2", "Choice 2"]
            ]
          }
        ]
      }
    ];
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
    // Select the fake power type from the dropdown
    await act(async () => {
      powerTypes
        .props()
        .onChange({ target: { name: "power_type", value: "fake_power_type" } });
    });
    wrapper.update();

    expect(
      wrapper.find("Input[name='power_parameters.field1']").props().label
    ).toBe("Required text");
    expect(
      wrapper.find("Input[name='power_parameters.field1']").props().required
    ).toBe(true);
    expect(
      wrapper.find("Input[name='power_parameters.field2']").props().label
    ).toBe("Non-required text");
    expect(
      wrapper.find("Input[name='power_parameters.field2']").props().required
    ).toBe(false);
    expect(
      wrapper.find("Select[name='power_parameters.field3']").props().label
    ).toBe("Select with choices");
    expect(
      wrapper.find("Select[name='power_parameters.field3']").find("option")
        .length
    ).toBe(2);
    expect(
      wrapper
        .find("Select[name='power_parameters.field3']")
        .find("option")
        .at(0)
        .text()
    ).toBe("Choice 1");
    expect(
      wrapper
        .find("Select[name='power_parameters.field3']")
        .find("option")
        .at(1)
        .text()
    ).toBe("Choice 2");
  });
});
