import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import AddChassisForm from "../AddChassisForm";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddChassisFormFields", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ name: "maas" })],
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          loaded: true,
        }),
      }),
    });
  });

  it("can render", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <AddChassisForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddChassisFormFields").exists()).toBe(true);
  });

  it("does not show power type fields that are scoped to nodes", async () => {
    const state = { ...initialState };
    state.general.powerTypes.data.push({
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
          scope: "node", // Should not show
        },
      ],
      can_probe: true,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <AddChassisForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      wrapper
        .find("select[name='power_type']")
        .props()
        .onChange({ target: { name: "power_type", value: "virsh" } });
    });
    wrapper.update();
    expect(
      wrapper.find("Input[name='power_parameters.power_address']").exists()
    ).toBe(true);
    expect(
      wrapper.find("Input[name='power_parameters.power_id']").exists()
    ).toBe(false);
  });
});
