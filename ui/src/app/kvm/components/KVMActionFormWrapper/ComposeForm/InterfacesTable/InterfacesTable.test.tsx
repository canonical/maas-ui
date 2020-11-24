import React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";

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

const mockStore = configureStore();

const generateWrapper = (store: MockStoreEnhanced, pod: Pod) =>
  mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: `/kvm/${pod.id}`, key: "testKey" }]}
      >
        <Route
          exact
          path="/kvm/:id"
          component={() => <ComposeForm setSelectedAction={jest.fn()} />}
        />
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
    const pod = podDetailsFactory({ attached_vlans: [], id: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(
      wrapper.find("[data-test='define-interfaces'] button").prop("disabled")
    ).toBe(true);
    expect(
      wrapper.find("[data-test='define-interfaces']").prop("message")
    ).toBe("There are no available subnets on this KVM's attached VLANs.");
  });

  it("disables add interface button if pod is composing a machine", () => {
    const pod = podDetailsFactory({ attached_vlans: [1], id: 1 });
    const subnet = subnetFactory({ vlan: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.pod.statuses = { [pod.id]: podStatusFactory({ composing: true }) };
    state.subnet.items = [subnet];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(
      wrapper.find("[data-test='define-interfaces'] button").prop("disabled")
    ).toBe(true);
  });

  it("can add and remove interfaces if KVM has available subnets", async () => {
    const pod = podDetailsFactory({ attached_vlans: [1], id: 1 });
    const subnet = subnetFactory({ vlan: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.subnet.items = [subnet];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Undefined interface row displays by default
    expect(wrapper.find("[data-test='undefined-interface']").exists()).toBe(
      true
    );
    expect(wrapper.find("InterfacesTable tbody TableRow").length).toBe(1);

    // Click "Define" button - table row should change to a defined interface
    await act(async () => {
      wrapper.find("[data-test='define-interfaces'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-test='undefined-interface']").exists()).toBe(
      false
    );
    expect(wrapper.find("InterfacesTable tbody TableRow").length).toBe(1);

    // Click "Add interface" - another defined interface should be added
    await act(async () => {
      wrapper.find("[data-test='define-interfaces'] button").simulate("click");
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

    // Click "Define" button
    // Fabric and VLAN should be auto assigned, PXE should be unknown
    await act(async () => {
      wrapper.find("[data-test='define-interfaces'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("TableCell[aria-label='Fabric']").text()).toBe(
      "Auto-assign"
    );
    expect(wrapper.find("TableCell[aria-label='VLAN']").text()).toBe(
      "Auto-assign"
    );
    expect(
      wrapper.find("TableCell[aria-label='PXE'] i").prop("className")
    ).toBe("p-icon--power-unknown");

    // Choose the subnet in state from the dropdown
    // Fabric and VLAN nams should display, PXE should be true
    await act(async () => {
      const links = wrapper.find("SubnetSelect ContextualMenu").prop("links");
      links[2].onClick();
    });
    wrapper.update();
    expect(wrapper.find("TableCell[aria-label='Fabric']").text()).toBe(
      fabric.name
    );
    expect(wrapper.find("TableCell[aria-label='VLAN']").text()).toBe(vlan.name);
    expect(
      wrapper.find("TableCell[aria-label='PXE'] i").prop("className")
    ).toBe("p-icon--success");
  });
});
