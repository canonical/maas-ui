import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EditPhysicalForm from "./EditPhysicalForm";

import { NetworkLinkMode } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("EditPhysicalForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabricFactory({}), fabricFactory()],
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [
              machineInterfaceFactory({
                id: 1,
              }),
            ],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory(), subnetFactory()],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [vlanFactory(), vlanFactory()],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditPhysicalForm nicId={1} systemId="abc123" close={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["fabric/fetch", "vlan/fetch"];
    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("displays a spinner when data is loading", () => {
    state.vlan.loaded = false;
    state.fabric.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditPhysicalForm nicId={1} systemId="abc123" close={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("correctly dispatches actions to edit a physical interface", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditPhysicalForm nicId={1} systemId="abc123" close={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    wrapper
      .find("Formik")
      .props()
      .onSubmit({
        fabric: 1,
        interface_speed: 1,
        ip_address: "1.2.3.4",
        link_speed: 1.5,
        mac_address: "28:21:c6:b9:1b:22",
        mode: NetworkLinkMode.STATIC,
        name: "eth1",
        subnet: 1,
        tags: ["a", "tag"],
        vlan: 1,
      });
    await waitForComponentToPaint(wrapper);
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateInterface")
    ).toStrictEqual({
      type: "machine/updateInterface",
      meta: {
        model: "machine",
        method: "update_interface",
      },
      payload: {
        params: {
          fabric: 1,
          interface_id: 1,
          interface_speed: 1000,
          ip_address: "1.2.3.4",
          link_speed: 1500,
          mac_address: "28:21:c6:b9:1b:22",
          mode: NetworkLinkMode.STATIC,
          name: "eth1",
          subnet: 1,
          system_id: "abc123",
          tags: ["a", "tag"],
          vlan: 1,
        },
      },
    });
  });
});
