import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NetworkFields, {
  Label as NetworkFieldsLabel,
  networkFieldsInitialValues,
} from "./NetworkFields";

import { Label as FabricSelectLabel } from "app/base/components/FabricSelect/FabricSelect";
import { Label as LinkModeSelectLabel } from "app/base/components/LinkModeSelect/LinkModeSelect";
import { Label as SubnetSelectLabel } from "app/base/components/SubnetSelect/SubnetSelect";
import { Label as VLANSelectLabel } from "app/base/components/VLANSelect/VLANSelect";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
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

describe("NetworkFields", () => {
  let state: RootState;

  beforeEach(() => {
    const vlan = vlanFactory({ fabric: 1, vid: 1 });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [
          fabricFactory({ id: 1, default_vlan_id: vlan.id }),
          fabricFactory({ default_vlan_id: vlan.id }),
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
        items: [
          subnetFactory({ vlan: vlan.id }),
          subnetFactory({ vlan: vlan.id }),
        ],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [vlan, vlanFactory({ fabric: 1, vid: 2 })],
        loaded: true,
      }),
    });
  });

  it("changes the vlan to the default for a fabric", async () => {
    const fabric = fabricFactory();
    state.vlan.items = [
      vlanFactory({ fabric: fabric.id, vid: 1 }),
      vlanFactory({ fabric: fabric.id, vid: 2 }),
    ];
    fabric.default_vlan_id = state.vlan.items[1].id;
    state.fabric.items = [fabric];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    const vlanSelect = screen.getByRole("combobox", {
      name: VLANSelectLabel.Select,
    });
    await waitFor(() =>
      expect(
        within(vlanSelect).getByRole("option", { selected: true })
      ).toHaveAttribute("value", state.vlan.items[0].id.toString())
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: FabricSelectLabel.Select }),
      {
        target: { value: fabric.id.toString() },
      }
    );
    await waitFor(() =>
      expect(
        within(vlanSelect).getByRole("option", { selected: true })
      ).toHaveAttribute("value", state.vlan.items[1].id.toString())
    );
  });

  it("resets all fields after vlan when the fabric is changed", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    const subnetSelect = screen.getByRole("combobox", {
      name: SubnetSelectLabel.Select,
    });
    await waitFor(() =>
      expect(
        within(subnetSelect).getByRole("option", { selected: true })
      ).toHaveAttribute("value", "")
    );
    // Set the values of the fields so they're all visible and have values.
    fireEvent.change(subnetSelect, {
      target: { value: state.subnet.items[1].id.toString() },
    });
    fireEvent.change(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select }),
      {
        target: { value: NetworkLinkMode.STATIC },
      }
    );
    userEvent.type(
      screen.getByRole("textbox", { name: NetworkFieldsLabel.IPAddress }),
      "1.2.3.4"
    );
    // Change the fabric and the other fields should reset.
    fireEvent.change(
      screen.getByRole("combobox", { name: FabricSelectLabel.Select }),
      {
        target: { value: state.fabric.items[1].id.toString() },
      }
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("combobox", { name: LinkModeSelectLabel.Select })
      ).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        within(subnetSelect).getByRole("option", { selected: true })
      ).toHaveAttribute("value", "")
    );
  });

  it("resets all fields after vlan when it is changed", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Set the values of the fields so they're all visible and have values.
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: state.subnet.items[1].id.toString() },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select }),
      {
        target: { value: NetworkLinkMode.STATIC },
      }
    );
    userEvent.type(
      screen.getByRole("textbox", { name: NetworkFieldsLabel.IPAddress }),
      "1.2.3.4"
    );
    // Change the VLAN and the other fields should reset.
    fireEvent.change(
      screen.getByRole("combobox", { name: VLANSelectLabel.Select }),
      {
        target: { value: state.subnet.items[1].id.toString() },
      }
    );
    const subnetSelect = screen.getByRole("combobox", {
      name: SubnetSelectLabel.Select,
    });
    await waitFor(() =>
      expect(
        within(subnetSelect).getByRole("option", { selected: true })
      ).toHaveAttribute("value", "")
    );
    expect(
      screen.queryByRole("combobox", { name: LinkModeSelectLabel.Select })
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).not.toBeInTheDocument()
    );
  });

  it("resets all fields after subnet when it is changed", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Set the values of the fields so they're all visible and have values.
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: state.subnet.items[1].id.toString() },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select }),
      {
        target: { value: NetworkLinkMode.STATIC },
      }
    );
    userEvent.type(
      screen.getByRole("textbox", { name: NetworkFieldsLabel.IPAddress }),
      "1.2.3.4"
    );
    // Change the subnet and the other fields should reset.
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: "" },
      }
    );
    expect(
      screen.queryByRole("combobox", { name: LinkModeSelectLabel.Select })
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).not.toBeInTheDocument()
    );
  });

  it("sets the ip address to the first address from the subnet when the mode is static", async () => {
    state.subnet.items.push(
      subnetFactory({
        statistics: subnetStatisticsFactory({
          first_address: "1.2.3.4",
        }),
        vlan: state.vlan.items[0].id,
      })
    );
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Set the values of the fields so they're all visible and have values.
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: state.subnet.items[2].id },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select }),
      {
        target: { value: NetworkLinkMode.STATIC },
      }
    );
    await waitFor(() =>
      expect(
        screen.getByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).toHaveAttribute("value", "1.2.3.4")
    );
  });

  it("does not display the mode field if a subnet has not been chosen", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.queryByRole("combobox", { name: LinkModeSelectLabel.Select })
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).not.toBeInTheDocument()
    );
  });

  it("displays the mode field if a subnet has been chosen", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: state.subnet.items[1].id.toString() },
      }
    );
    expect(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select })
    ).toBeInTheDocument();
    const linkModeSelect = screen.getByRole("combobox", {
      name: LinkModeSelectLabel.Select,
    });
    await waitFor(() =>
      expect(
        within(linkModeSelect).getByRole("option", { selected: true })
      ).toHaveAttribute("value", NetworkLinkMode.LINK_UP)
    );
  });

  it("reset the mode field to 'auto' when editing and changed subnet", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields
              interfaceType={NetworkInterfaceTypes.PHYSICAL}
              editing
            />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: state.subnet.items[1].id.toString() },
      }
    );
    expect(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select })
    ).toBeInTheDocument();
    const linkModeSelect = screen.getByRole("combobox", {
      name: LinkModeSelectLabel.Select,
    });
    await waitFor(() =>
      expect(
        within(linkModeSelect).getByRole("option", { selected: true })
      ).toHaveAttribute("value", NetworkLinkMode.AUTO)
    );
  });

  it("reset the mode field to 'unconfigured' when editing and removed subnet", async () => {
    const store = mockStore(state);
    const onSubmit = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={{
              ...networkFieldsInitialValues,
              mode: NetworkLinkMode.AUTO,
            }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit} aria-label="test form">
                <NetworkFields
                  interfaceType={NetworkInterfaceTypes.PHYSICAL}
                  editing
                />
              </form>
            )}
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    // Remove the subnet.
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: "" },
      }
    );
    expect(
      screen.queryByRole("combobox", { name: LinkModeSelectLabel.Select })
    ).not.toBeInTheDocument();
    fireEvent.submit(screen.getByRole("form", { name: "test form" }));
    await waitFor(() =>
      expect(onSubmit.mock.calls[0][0].mode).toBe(NetworkLinkMode.LINK_UP)
    );
  });

  it("does not display the ip address field if the mode has not been chosen", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).not.toBeInTheDocument()
    );
  });

  it("does not display the ip address field if the chosen mode is not static", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: state.subnet.items[1].id.toString() },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select }),
      {
        target: { value: NetworkLinkMode.AUTO },
      }
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).not.toBeInTheDocument()
    );
  });

  it("displays the ip address field if the mode is static", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={networkFieldsInitialValues}
            onSubmit={jest.fn()}
          >
            <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: SubnetSelectLabel.Select }),
      {
        target: { value: state.subnet.items[1].id.toString() },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: LinkModeSelectLabel.Select }),
      {
        target: { value: NetworkLinkMode.STATIC },
      }
    );
    await waitFor(() =>
      expect(
        screen.getByRole("textbox", { name: NetworkFieldsLabel.IPAddress })
      ).toBeInTheDocument()
    );
  });
});
