import ComposeForm from "../ComposeForm";

import urls from "app/base/urls";
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
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import {
  screen,
  renderWithBrowserRouter,
  userEvent,
  within,
} from "testing/utils";

describe("InterfacesTable", () => {
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

  it("disables add interface button with tooltip if KVM has no available subnets", async () => {
    const pod = podDetailsFactory({
      attached_vlans: [],
      boot_vlans: [],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];

    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
      { state, route: urls.kvm.lxd.single.index({ id: pod.id }) }
    );

    expect(screen.queryByRole("button", { name: /define/i })).toBeDisabled();
    await userEvent.hover(screen.getByRole("button", { name: /define/i }));
    expect(
      screen.getByText("There are no available networks seen by this KVM host.")
    ).toBeInTheDocument();
  });

  it("disables add interface button with tooltip if KVM host has no PXE-enabled networks", async () => {
    const fabric = fabricFactory();
    const vlan = vlanFactory({ fabric: fabric.id });
    const subnet = subnetFactory({ vlan: vlan.id });
    const pod = podDetailsFactory({
      attached_vlans: [vlan.id],
      boot_vlans: [],
      id: 1,
    });
    const state = { ...initialState };
    state.fabric.items = [fabric];
    state.pod.items = [pod];
    state.subnet.items = [subnet];
    state.vlan.items = [vlan];
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
      { state, route: urls.kvm.lxd.single.index({ id: pod.id }) }
    );
    expect(screen.getByRole("button", { name: /define/i })).toBeDisabled();
    await userEvent.hover(screen.getByRole("button", { name: /define/i }));
    expect(
      screen.getByText(
        "There are no PXE-enabled networks seen by this KVM host."
      )
    ).toBeInTheDocument();
  });

  it("disables add interface button if pod is composing a machine", () => {
    const pod = podDetailsFactory({
      attached_vlans: [1],
      boot_vlans: [1],
      id: 1,
    });
    const subnet = subnetFactory({ vlan: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.pod.statuses = { [pod.id]: podStatusFactory({ composing: true }) };
    state.subnet.items = [subnet];

    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
      { state, route: urls.kvm.lxd.single.index({ id: pod.id }) }
    );
    expect(screen.queryByRole("button", { name: /define/i })).toBeDisabled();
  });

  it("can add and remove interfaces if KVM has PXE-enabled subnets", async () => {
    const pod = podDetailsFactory({
      attached_vlans: [1],
      boot_vlans: [1],
      id: 1,
    });
    const subnet = subnetFactory({ vlan: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.subnet.items = [subnet];

    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
      { state, route: urls.kvm.lxd.single.index({ id: pod.id }) }
    );
    // Undefined interface row displays by default
    expect(screen.getByTestId("undefined-interface")).toBeInTheDocument();
    expect(screen.queryByTestId("interface")).not.toBeInTheDocument();

    // Click "Define" button - table row should change to a defined interface
    await userEvent.click(screen.getByRole("button", { name: /Define/i }));
    expect(screen.queryByTestId("undefined-interface")).not.toBeInTheDocument();
    expect(screen.getByTestId("interface")).toBeInTheDocument();

    // Click "Add interface" - another defined interface should be added
    await userEvent.click(
      screen.getByRole("button", { name: /Add interface/i })
    );
    expect(screen.getAllByTestId("interface")).toHaveLength(2);

    // Click delete button - a defined interface should be removed
    await userEvent.click(
      screen.getAllByRole("button", { name: /Delete/i })[0]
    );
    expect(screen.getAllByTestId("interface")).toHaveLength(1);
  });

  it("correctly displays fabric, vlan and PXE details of selected subnet", async () => {
    const fabric = fabricFactory();
    const vlan = vlanFactory({ fabric: fabric.id });
    const subnet = subnetFactory({ vlan: vlan.id });
    const pod = podDetailsFactory({
      attached_vlans: [vlan.id],
      boot_vlans: [vlan.id],
      id: 1,
    });
    const state = { ...initialState };
    state.fabric.items = [fabric];
    state.pod.items = [pod];
    state.subnet.items = [subnet];
    state.vlan.items = [vlan];
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
      { state, route: urls.kvm.lxd.single.index({ id: pod.id }) }
    );

    // Click "Define" button to open interfaces table.
    await userEvent.click(screen.getByRole("button", { name: /Define/i }));
    // Open the menu:
    await userEvent.click(screen.getByRole("button", { name: subnet.name }));
    // Choose the subnet in state from the dropdown
    // Fabric and VLAN nams should display, PXE should be true
    await userEvent.click(
      within(screen.getByLabelText("submenu")).getByRole("button")
    );
    expect(screen.getByText(fabric.name)).toHaveAccessibleName("Fabric");
    expect(screen.getByText(vlan.name)).toHaveAccessibleName("VLAN");
    expect(screen.getByText("PXE"));
    expect(screen.getByLabelText("success"));
  });

  it("preselects the first PXE network if there is one available", async () => {
    const fabric = fabricFactory({ name: "pxe-fabric" });
    const nonBootVlan = vlanFactory({ fabric: fabric.id });
    const bootVlan = vlanFactory({ fabric: fabric.id, name: "pxe-vlan" });
    const nonBootSubnet = subnetFactory({ vlan: nonBootVlan.id });
    const bootSubnet = subnetFactory({ name: "pxe-subnet", vlan: bootVlan.id });
    const pod = podDetailsFactory({
      attached_vlans: [nonBootVlan.id, bootVlan.id],
      boot_vlans: [bootVlan.id],
      id: 1,
    });
    const state = { ...initialState };
    state.fabric.items = [fabric];
    state.pod.items = [pod];
    state.subnet.items = [nonBootSubnet, bootSubnet];
    state.vlan.items = [nonBootVlan, bootVlan];
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
      { state, route: urls.kvm.lxd.single.index({ id: pod.id }) }
    );

    // Click "Define" button to open interfaces table.
    // It should be prepopulated with the first available PXE network details.
    await userEvent.click(screen.getByRole("button", { name: /Define/i }));
    expect(
      screen.getByRole("button", { name: /pxe-subnet/i })
    ).toHaveAccessibleDescription("Subnet");
    expect(screen.getByText("pxe-fabric")).toHaveAccessibleName("Fabric");
    expect(screen.getByText("pxe-vlan")).toHaveAccessibleName("VLAN");
    expect(screen.getByText("PXE"));
    expect(screen.getByLabelText("success"));
  });
});
