import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import type { MockStore } from "redux-mock-store";
import configureStore from "redux-mock-store";

import ComposeForm from "../ComposeForm";

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
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

const generateWrapper = (store: MockStore, pod: Pod) =>
  mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: `/kvm/${pod.id}`, key: "testKey" }]}
      >
        <CompatRouter>
          <ComposeForm clearHeaderContent={jest.fn()} hostId={pod.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
        loaded: true,
      }),
    });
  });

  it("disables add interface button with tooltip if KVM has no available subnets", () => {
    const pod = podDetailsFactory({
      attached_vlans: [],
      boot_vlans: [],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(
      wrapper.find("[data-testid='define-interfaces'] button").prop("disabled")
    ).toBe(true);
    expect(
      wrapper.find("[data-testid='define-interfaces']").prop("message")
    ).toBe("There are no available networks seen by this KVM host.");
  });

  it("disables add interface button with tooltip if KVM host has no PXE-enabled networks", () => {
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
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(
      wrapper.find("[data-testid='define-interfaces'] button").prop("disabled")
    ).toBe(true);
    expect(
      wrapper.find("[data-testid='define-interfaces']").prop("message")
    ).toBe("There are no PXE-enabled networks seen by this KVM host.");
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
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(
      wrapper.find("[data-testid='define-interfaces'] button").prop("disabled")
    ).toBe(true);
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
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Undefined interface row displays by default
    expect(wrapper.find("[data-testid='undefined-interface']").exists()).toBe(
      true
    );
    expect(wrapper.find("InterfacesTable tbody TableRow").length).toBe(1);

    // Click "Define" button - table row should change to a defined interface
    await act(async () => {
      wrapper
        .find("[data-testid='define-interfaces'] button")
        .simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='undefined-interface']").exists()).toBe(
      false
    );
    expect(wrapper.find("InterfacesTable tbody TableRow").length).toBe(1);

    // Click "Add interface" - another defined interface should be added
    await act(async () => {
      wrapper
        .find("[data-testid='define-interfaces'] button")
        .simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("InterfacesTable tbody TableRow").length).toBe(2);

    // Click delete button - a defined interface should be removed
    await act(async () => {
      wrapper.find("TableActions button").at(0).simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("InterfacesTable tbody TableRow").length).toBe(1);
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
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Click "Define" button to open interfaces table.
    await act(async () => {
      wrapper
        .find("[data-testid='define-interfaces'] button")
        .simulate("click");
    });
    wrapper.update();
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    // Choose the subnet in state from the dropdown
    // Fabric and VLAN nams should display, PXE should be true
    await act(async () => {
      wrapper
        .find("SubnetSelect ContextualMenu .kvm-subnet-select__subnet")
        .last()
        .simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("TableCell[data-heading='Fabric']").text()).toBe(
      fabric.name
    );
    expect(wrapper.find("TableCell[data-heading='VLAN']").text()).toBe(
      vlan.name
    );
    expect(
      wrapper.find("TableCell[data-heading='PXE'] i").prop("className")
    ).toBe("p-icon--success");
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
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Click "Define" button to open interfaces table.
    // It should be prepopulated with the first available PXE network details.
    wrapper.find("[data-testid='define-interfaces'] button").simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("SubnetSelect").text()).toBe("pxe-subnet");
    expect(wrapper.find("TableCell[data-heading='Fabric']").text()).toBe(
      "pxe-fabric"
    );
    expect(wrapper.find("TableCell[data-heading='VLAN']").text()).toBe(
      "pxe-vlan"
    );
    expect(
      wrapper.find("TableCell[data-heading='PXE'] i").prop("className")
    ).toBe("p-icon--success");
  });
});
