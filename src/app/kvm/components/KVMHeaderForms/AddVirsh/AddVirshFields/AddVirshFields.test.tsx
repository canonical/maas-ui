import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddVirsh from "../AddVirsh";

import { ConfigNames } from "app/store/config/types";
import { PowerTypeNames } from "app/store/general/constants";
import { PowerFieldScope } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  podState as podStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddVirshFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: ConfigNames.MAAS_NAME, value: "MAAS" }],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [],
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

  it("does not show power type fields that are scoped to nodes", () => {
    const powerTypes = [
      powerTypeFactory({
        description: "Virsh (virtual systems)",
        fields: [
          powerFieldFactory({ name: "field1", scope: PowerFieldScope.BMC }),
          powerFieldFactory({ name: "field2", scope: PowerFieldScope.NODE }),
        ],
        name: PowerTypeNames.VIRSH,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <AddVirsh clearHeaderContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Input[name='power_parameters.field1']").exists()).toBe(
      true
    );
    expect(wrapper.find("Input[name='power_parameters.field2']").exists()).toBe(
      false
    );
  });
});
