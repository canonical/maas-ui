import type { MockStore } from "redux-mock-store";
import configureStore from "redux-mock-store";

import ComposeForm from "../../ComposeForm";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  domainState as domainStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "testing/utils";

const mockStore = configureStore<RootState>();

const renderComposeForm = (store: MockStore, pod: Pod) =>
  renderWithBrowserRouter(
    <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
    { route: `/kvm/${pod.id}`, store }
  );

describe("SubnetSelect", () => {
  let initialState: RootState;

  beforeEach(() => {
    const pod = podDetailsFactory({ id: 1 });

    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        items: [pod],
        loaded: true,
        statuses: { [pod.id]: podStatusFactory() },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
      space: spaceStateFactory({
        loaded: true,
      }),
      subnet: subnetStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
      }),
    });
  });

  it("groups subnets by space if a space is not yet selected", async () => {
    const spaces = [
      spaceFactory({ name: "Outer" }),
      spaceFactory({ name: "Safe" }),
    ];
    const subnets = [
      subnetFactory({ space: spaces[0].id, vlan: 1, name: "sub1" }),
      subnetFactory({ space: spaces[1].id, vlan: 1, name: "sub2" }),
      subnetFactory({ space: spaces[0].id, vlan: 1, name: "sub3" }),
    ];
    const pod = podDetailsFactory({
      attached_vlans: [1],
      boot_vlans: [1],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = spaces;
    state.subnet.items = subnets;
    const store = mockStore(state);
    renderComposeForm(store, pod);

    // Click "Define" button
    await userEvent.click(
      screen.getByRole("button", { name: "Define (optional)" })
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Space" }),
      ""
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Select subnet..." })
    );

    const spaceGroups = screen.getByLabelText("submenu").children;

    expect(spaceGroups).toHaveLength(5);
    expect(spaceGroups[0]).toHaveTextContent("Space: Outer");
    expect(spaceGroups[1]).toHaveTextContent("sub1");
    expect(spaceGroups[2]).toHaveTextContent("sub3");
    expect(spaceGroups[3]).toHaveTextContent("Space: Safe");
    expect(spaceGroups[4]).toHaveTextContent("sub2");
  });

  it("filters subnets by selected space", async () => {
    const space = spaceFactory({ id: 0, name: "Outer" });
    const [subnetInSpace, subnetNotInSpace] = [
      subnetFactory({ space: space.id, vlan: 1, name: "sub1" }),
      subnetFactory({ space: null, vlan: 1, name: "sub2" }),
    ];
    const pod = podDetailsFactory({
      attached_vlans: [1],
      boot_vlans: [1],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = [space];
    state.subnet.items = [subnetInSpace, subnetNotInSpace];
    const store = mockStore(state);
    renderComposeForm(store, pod);

    // Click "Define" button
    await userEvent.click(
      screen.getByRole("button", { name: "Define (optional)" })
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Space" }),
      ""
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Select subnet..." })
    );

    let spaceGroups = screen.getByLabelText("submenu").children;

    expect(spaceGroups[0]).toHaveTextContent("Space: Outer");
    expect(spaceGroups[1]).toHaveTextContent("sub1");
    expect(spaceGroups[2]).toHaveTextContent("No space");
    expect(spaceGroups[3]).toHaveTextContent("sub2");
    expect(spaceGroups).toHaveLength(4);

    // Choose the space in state from the dropdown
    // Only the subnet in the selected space should be available
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Space" }),
      "0"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Select subnet..." })
    );

    spaceGroups = screen.getByLabelText("submenu").children;

    expect(spaceGroups).toHaveLength(1);
    expect(spaceGroups[0]).toHaveTextContent("sub1");
  });

  it("shows an error if multiple interfaces defined without at least one PXE network", async () => {
    const fabric = fabricFactory();
    const space = spaceFactory();
    const pxeVlan = vlanFactory({
      fabric: fabric.id,
      id: 1,
      name: "test-vlan-1",
    });
    const nonPxeVlan = vlanFactory({ fabric: fabric.id, id: 2 });
    const pxeSubnet = subnetFactory({ name: "pxe", vlan: pxeVlan.id });
    const nonPxeSubnet = subnetFactory({
      name: "non-pxe",
      vlan: nonPxeVlan.id,
    });
    const pod = podDetailsFactory({
      attached_vlans: [pxeVlan.id, nonPxeVlan.id],
      boot_vlans: [pxeVlan.id],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = [space];
    state.subnet.items = [pxeSubnet, nonPxeSubnet];
    state.vlan.items = [pxeVlan, nonPxeVlan];
    const store = mockStore(state);
    renderComposeForm(store, pod);

    // Click "Define" button
    await userEvent.click(
      screen.getByRole("button", { name: "Define (optional)" })
    );

    // Add a second interface
    await userEvent.click(
      screen.getByRole("button", { name: "Add interface" })
    );

    // Select non-PXE network for the first interface
    await userEvent.selectOptions(
      screen.getAllByRole("combobox", { name: "Space" })[0],
      ""
    );
    await userEvent.click(
      screen.getAllByRole("button", { name: "Select subnet..." })[0]
    );
    await userEvent.click(
      within(screen.getByLabelText("submenu")).getByRole("button", {
        name: /non-pxe/i,
      })
    );

    // Select non-PXE network for the second interface - error should be present.
    await userEvent.selectOptions(
      screen.getAllByRole("combobox", { name: "Space" })[1],
      ""
    );
    await userEvent.click(
      screen.getAllByRole("button", { name: "Select subnet..." })[0]
    );
    await userEvent.click(
      within(screen.getByLabelText("submenu")).getByRole("button", {
        name: /non-pxe/i,
      })
    );
    expect(screen.getByTestId("no-pxe")).toHaveTextContent(
      "Error: Select at least 1 PXE network when creating multiple interfaces."
    );

    // Select PXE network for the second interface - error should be removed.
    await userEvent.click(screen.getAllByText("non-pxe")[1]);
    await userEvent.click(
      within(screen.getByLabelText("submenu")).getByRole("button", {
        name: /pxe test-vlan-1/i,
      })
    );
    expect(screen.queryByTestId("no-pxe")).not.toBeInTheDocument();

    // Remove second interface with PXE network - error should still not show.
    await userEvent.click(screen.getAllByTestId("delete-interface")[1]);
    expect(screen.queryByTestId("no-pxe")).not.toBeInTheDocument();
  });
});
