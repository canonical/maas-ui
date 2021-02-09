import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DhcpForm from "app/base/components/DhcpForm";
import type { RootState } from "app/store/root/types";
import {
  controllerState as controllerStateFactory,
  deviceState as deviceStateFactory,
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DhcpFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({ loaded: true }),
      device: deviceStateFactory({ loaded: true }),
      dhcpsnippet: dhcpSnippetStateFactory({
        items: [
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10",
          }),
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39",
          }),
        ],
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({
            fqdn: "node2.maas",
          }),
        ],
        loaded: true,
      }),
      subnet: subnetStateFactory({
        items: [
          subnetFactory({
            id: 1,
            name: "test.local",
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DhcpFormFields").exists()).toBe(true);
  });

  it("shows a notification if editing and disabled", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpForm
            analyticsCategory="settings"
            id={state.dhcpsnippet.items[0].id}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
  });

  it("shows a loader if the models have not loaded", async () => {
    state.subnet.loading = true;
    state.device.loading = true;
    state.controller.loading = true;
    state.machine.loading = true;
    state.subnet.loaded = false;
    state.device.loaded = false;
    state.controller.loaded = false;
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );
    const select = wrapper.find("select[name='type']");
    await act(async () => {
      select.props().onChange({ target: { name: "type", value: "subnet" } });
    });
    wrapper.update();
    expect(wrapper.find("Spinner").exists()).toBe(true);
    expect(
      wrapper
        .findWhere(
          (n) => n.name() === "FormikField" && n.prop("name") === "entity"
        )
        .exists()
    ).toBe(false);
  });

  it("shows the entity options for a chosen type", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );
    const select = wrapper.find("select[name='type']");
    await act(async () => {
      select.props().onChange({ target: { name: "type", value: "subnet" } });
    });
    wrapper.update();
    expect(wrapper.find("Spinner").exists()).toBe(false);
    expect(
      wrapper
        .findWhere(
          (n) => n.name() === "FormikField" && n.prop("name") === "entity"
        )
        .exists()
    ).toBe(true);
  });

  it("resets the entity if the type changes", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpForm analyticsCategory="settings" />
        </MemoryRouter>
      </Provider>
    );

    let typeSelect = wrapper.find("select[name='type']");
    await act(async () => {
      // Set an initial type.
      typeSelect
        .props()
        .onChange({ target: { name: "type", value: "machine" } });
    });
    wrapper.update();
    let entitySelect = wrapper.find("select[name='entity']");
    await act(async () => {
      // Select a machine.
      entitySelect.props().onChange({ target: { name: "entity", value: "2" } });
    });
    wrapper.update();
    entitySelect = wrapper.find("select[name='entity']");
    expect(entitySelect.prop("value")).toEqual("2");
    typeSelect = wrapper.find("select[name='type']");
    await act(async () => {
      // Change the type.
      typeSelect
        .props()
        .onChange({ target: { name: "type", value: "subnet" } });
    });
    wrapper.update();
    entitySelect = wrapper.find("select[name='entity']");
    // The select value should have been cleared.
    expect(entitySelect.prop("value")).toEqual("");
  });
});
