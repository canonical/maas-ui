import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddKVMForm from "../AddKVMForm";

import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  podState as podStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddKVMFormFields", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "maas_name", value: "MAAS" }],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
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
            }),
            powerTypeFactory({
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
            }),
          ],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory()],
        loaded: true,
      }),
    });
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
      chassis: true,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <AddKVMForm />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("Input[name='power_parameters.power_address']").exists()
    ).toBe(true);
    expect(
      wrapper.find("Input[name='power_parameters.power_id']").exists()
    ).toBe(false);
  });
});
