import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddChassisForm from "../AddChassisForm";

import { PowerTypeNames } from "app/store/general/constants";
import { PowerFieldScope, PowerFieldType } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddChassisFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <AddChassisForm clearSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddChassisFormFields").exists()).toBe(true);
  });

  it("does not show power type fields that are scoped to nodes", async () => {
    state.general.powerTypes.data.push(
      powerTypeFactory({
        name: PowerTypeNames.VIRSH,
        description: "Virsh (virtual systems)",
        fields: [
          powerFieldFactory({
            name: "power_address",
            label: "Address",
            required: true,
            field_type: PowerFieldType.STRING,
            choices: [],
            default: "",
            scope: PowerFieldScope.BMC,
          }),
          powerFieldFactory({
            name: "power_pass",
            label: "Password (optional)",
            required: false,
            field_type: PowerFieldType.PASSWORD,
            choices: [],
            default: "",
            scope: PowerFieldScope.BMC,
          }),
          powerFieldFactory({
            name: "power_id",
            label: "Virsh VM ID",
            required: true,
            field_type: PowerFieldType.STRING,
            choices: [],
            default: "",
            scope: PowerFieldScope.NODE, // Should not show
          }),
        ],
        can_probe: true,
      })
    );
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <AddChassisForm clearSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      wrapper.find("select[name='power_type']").simulate("change", {
        target: { name: "power_type", value: PowerTypeNames.VIRSH },
      });
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
