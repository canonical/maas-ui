import { mockStore } from "testing/mocks";

import EditPhysicalForm from "./EditPhysicalForm";

import { NetworkLinkMode } from "app/store/types/enum";
import {
  fabric as fabricFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  vlan as vlanFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  waitForComponentToPaint,
} from "testing/utils";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(() => jest.fn()),
}));

describe("EditPhysicalForm", () => {
  let state;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: {
        items: [fabricFactory({}), fabricFactory()],
        loaded: true,
      },
      machine: {
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
      },
      subnet: {
        items: [subnetFactory(), subnetFactory()],
        loaded: true,
      },
      vlan: {
        items: [vlanFactory(), vlanFactory()],
        loaded: true,
      },
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditPhysicalForm close={jest.fn()} nicId={1} systemId="abc123" />,
      { route: "/machines", store }
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
    const wrapper = renderWithBrowserRouter(
      <EditPhysicalForm close={jest.fn()} nicId={1} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("correctly dispatches actions to edit a physical interface", async () => {
    const store = mockStore(state);
    const wrapper = renderWithBrowserRouter(
      <EditPhysicalForm close={jest.fn()} nicId={1} systemId="abc123" />,
      { route: "/machines", store }
    );

    userEvent.type(screen.getByLabelText("Interface Name"), "eth1");
    userEvent.type(screen.getByLabelText("IP Address"), "1.2.3.4");
    userEvent.type(screen.getByLabelText("MAC Address"), "28:21:c6:b9:1b:22");
    userEvent.type(screen.getByLabelText("Interface Speed (Mbps)"), "1");
    userEvent.type(screen.getByLabelText("Link Speed (Mbps)"), "1.5");
    userEvent.selectOptions(
      screen.getByLabelText("Mode"),
      NetworkLinkMode.STATIC
    );
    userEvent.selectOptions(screen.getByLabelText("Fabric"), "1");
    userEvent.selectOptions(screen.getByLabelText("Subnet"), "1");
    userEvent.selectOptions(screen.getByLabelText("VLAN"), "1");
    userEvent.click(screen.getByRole("button", { name: "Update Interface" }));

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
          tags: undefined,
          vlan: 1,
        },
      },
    });
  });
});
