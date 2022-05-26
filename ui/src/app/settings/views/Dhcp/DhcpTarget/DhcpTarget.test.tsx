import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DhcpTarget from "./DhcpTarget";

import type { RootState } from "app/store/root/types";
import {
  controllerState as controllerStateFactory,
  deviceState as deviceStateFactory,
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DhcpTarget", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
      }),
      device: deviceStateFactory({
        loaded: true,
      }),
      dhcpsnippet: dhcpSnippetStateFactory({
        loaded: true,
        items: [
          dhcpSnippetFactory({ id: 1, name: "class", description: "" }),
          dhcpSnippetFactory({
            id: 2,
            name: "lease",
            subnet: 2,
            description: "",
          }),
          dhcpSnippetFactory({
            id: 3,
            name: "boot",
            node: "xyz",
            description: "",
          }),
        ],
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "xyz",
            hostname: "machine1",
            domain: modelRefFactory({ name: "test" }),
          }),
        ],
      }),
      subnet: subnetStateFactory({
        loaded: true,
        items: [
          subnetFactory({ id: 1, name: "10.0.0.99" }),
          subnetFactory({ id: 2, name: "test.maas" }),
        ],
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.controller.loading = true;
    state.device.loading = true;
    state.dhcpsnippet.loading = true;
    state.machine.loading = true;
    state.subnet.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <DhcpTarget subnetId={808} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can display a subnet link", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <DhcpTarget subnetId={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const link = wrapper.find("Link");
    expect(link?.prop("to")?.toString().includes("/subnet/1")).toBe(true);
    expect(link.text()).toEqual("10.0.0.99");
  });

  it("can display a node link", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <DhcpTarget nodeId="xyz" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const link = wrapper.find("Link");
    expect(link.prop("to")).toBe("/machine/xyz");
    expect(link).toMatchSnapshot();
  });
});
