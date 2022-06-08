import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { VLANsColumn } from "./VLANsColumn";

import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVlansHA as controllerVlansHAFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VLANsColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({
            system_id: "abc123",
            vlans_ha: controllerVlansHAFactory({
              true: 2,
              false: 1,
            }),
          }),
        ],
      }),
    });
  });

  it("displays total number of vlans", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <CompatRouter>
            <VLANsColumn systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="vlan-count"]').text()).toEqual("3");
  });

  it("displays ha details", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <CompatRouter>
            <VLANsColumn systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="ha-vlans"]').text()).toEqual(
      "Non-HA(1), HA(2)"
    );
  });
});
