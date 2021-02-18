import { mount } from "enzyme";
import type { ReactWrapper } from "enzyme";
import { Formik } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NetworkFields from "./NetworkFields";

import { NetworkLinkMode } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  subnetStatistics as subnetStatisticsFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const changeField = async (
  wrapper: ReactWrapper,
  selector: string,
  name: string,
  value: unknown
) => {
  return act(async () => {
    wrapper.find(selector).simulate("change", {
      target: {
        name,
        value,
      },
    });
  });
};

describe("NetworkFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [
          fabricFactory({ default_vlan_id: 1 }),
          fabricFactory({ default_vlan_id: 1 }),
        ],
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
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
        items: [vlanFactory({ id: 1 }), vlanFactory()],
        loaded: true,
      }),
    });
  });

  it("changes the vlan to the default for a fabric", async () => {
    state.fabric.items = [fabricFactory({ id: 2, default_vlan_id: 3 })];
    state.vlan.items = [vlanFactory({ id: 1 }), vlanFactory({ id: 3 })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("VLANSelect select").prop("value")).toBeUndefined();
    await changeField(wrapper, "FabricSelect select", "fabric", 2);
    wrapper.update();
    expect(wrapper.find("VLANSelect select").prop("value")).toBe(3);
  });

  it("resets all fields after vlan when the fabric is changed", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Set the values of the fields so they're all visible and have values.
    await changeField(wrapper, "SubnetSelect select", "subnet", 2);
    wrapper.update();
    await changeField(
      wrapper,
      "LinkModeSelect select",
      "mode",
      NetworkLinkMode.STATIC
    );
    wrapper.update();
    await changeField(
      wrapper,
      "FormikField[name='ip_address'] input",
      "ip_address",
      "1.2.3.4"
    );
    // Change the fabric and the other fields should reset.
    await changeField(wrapper, "FabricSelect select", "fabric", 2);
    wrapper.update();
    expect(wrapper.find("SubnetSelect select").prop("value")).toBe("");
    expect(wrapper.find("LinkModeSelect").exists()).toBe(false);
    expect(wrapper.find("FormikField[name='ip_address']").exists()).toBe(false);
  });

  it("resets all fields after vlan when it is changed", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Set the values of the fields so they're all visible and have values.
    await changeField(wrapper, "SubnetSelect select", "subnet", 2);
    wrapper.update();
    await changeField(
      wrapper,
      "LinkModeSelect select",
      "mode",
      NetworkLinkMode.STATIC
    );
    wrapper.update();
    await changeField(
      wrapper,
      "FormikField[name='ip_address'] input",
      "ip_address",
      "1.2.3.4"
    );
    // Change the VLAN and the other fields should reset.
    await changeField(wrapper, "VLANSelect select", "vlan", 2);
    wrapper.update();
    expect(wrapper.find("SubnetSelect select").prop("value")).toBe("");
    expect(wrapper.find("LinkModeSelect").exists()).toBe(false);
    expect(wrapper.find("FormikField[name='ip_address']").exists()).toBe(false);
  });

  it("resets all fields after subnet when it is changed", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Set the values of the fields so they're all visible and have values.
    await changeField(wrapper, "SubnetSelect select", "subnet", 2);
    wrapper.update();
    await changeField(
      wrapper,
      "LinkModeSelect select",
      "mode",
      NetworkLinkMode.STATIC
    );
    wrapper.update();
    await changeField(
      wrapper,
      "FormikField[name='ip_address'] input",
      "ip_address",
      "1.2.3.4"
    );
    // Change the subnet and the other fields should reset.
    await changeField(wrapper, "SubnetSelect select", "subnet", "");
    wrapper.update();
    expect(wrapper.find("LinkModeSelect").exists()).toBe(false);
    expect(wrapper.find("FormikField[name='ip_address']").exists()).toBe(false);
  });

  it("sets the ip address to the first address from the subnet when the mode is static", async () => {
    state.subnet.items.push(
      subnetFactory({
        id: 3,
        statistics: subnetStatisticsFactory({
          first_address: "1.2.3.4",
        }),
      })
    );
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Set the values of the fields so they're all visible and have values.
    await changeField(wrapper, "SubnetSelect select", "subnet", 3);
    wrapper.update();
    await changeField(
      wrapper,
      "LinkModeSelect select",
      "mode",
      NetworkLinkMode.STATIC
    );
    wrapper.update();
    expect(
      wrapper.find("FormikField[name='ip_address'] input").prop("value")
    ).toBe("1.2.3.4");
  });

  it("does not display the mode field if a subnet has not been chosen", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LinkModeSelect").exists()).toBe(false);
    expect(wrapper.find("FormikField[name='ip_address']").exists()).toBe(false);
  });

  it("displays the mode field if a subnet has been chosen", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await changeField(wrapper, "SubnetSelect select", "subnet", 2);
    wrapper.update();
    expect(wrapper.find("LinkModeSelect").exists()).toBe(true);
  });

  it("does not display the ip address field if the mode has not been chosen", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikField[name='ip_address']").exists()).toBe(false);
  });

  it("does not display the ip address field if the chosen mode is not static", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await changeField(wrapper, "SubnetSelect select", "subnet", 2);
    wrapper.update();
    await changeField(
      wrapper,
      "LinkModeSelect select",
      "mode",
      NetworkLinkMode.AUTO
    );
    wrapper.update();
    expect(wrapper.find("FormikField[name='ip_address']").exists()).toBe(false);
  });

  it("displays the ip address field if the mode is static", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <NetworkFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await changeField(wrapper, "SubnetSelect select", "subnet", 2);
    wrapper.update();
    await changeField(
      wrapper,
      "LinkModeSelect select",
      "mode",
      NetworkLinkMode.STATIC
    );
    wrapper.update();
    expect(wrapper.find("FormikField[name='ip_address']").exists()).toBe(true);
  });
});
