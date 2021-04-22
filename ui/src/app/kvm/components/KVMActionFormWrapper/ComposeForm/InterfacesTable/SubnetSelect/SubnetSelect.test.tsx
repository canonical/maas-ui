import * as React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import type { MockStore } from "redux-mock-store";
import configureStore from "redux-mock-store";

import ComposeForm from "../../ComposeForm";

import type { MenuLink } from "./SubnetSelect";

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
        <Route
          exact
          path="/kvm/:id"
          component={() => <ComposeForm setSelectedAction={jest.fn()} />}
        />
      </MemoryRouter>
    </Provider>
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
        loaded: true,
      }),
    });
  });

  it("groups subnets by space if a space is not yet selected", async () => {
    const spaces = [
      spaceFactory({ name: "Outer" }),
      spaceFactory({ name: "Safe" }),
    ];
    const subnets = [
      subnetFactory({ space: spaces[0].id, vlan: 1 }),
      subnetFactory({ space: spaces[0].id, vlan: 1 }),
      subnetFactory({ space: spaces[1].id, vlan: 1 }),
    ];
    const pod = podDetailsFactory({ attached_vlans: [1], id: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = spaces;
    state.subnet.items = subnets;
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Click "Define" button
    await act(async () => {
      wrapper.find("[data-test='define-interfaces'] button").simulate("click");
    });
    wrapper.update();

    const links = wrapper
      .find("SubnetSelect ContextualMenu")
      .prop("links") as MenuLink[];

    // "Space: Outer" + outer subnets + "Space: Safe" + safe subnets
    expect(links.length).toBe(5);
    expect(links[0]).toBe("Space: Outer");
    expect(links[3]).toBe("Space: Safe");
  });

  it("filters subnets by selected space", async () => {
    const space = spaceFactory();
    const [subnetInSpace, subnetNotInSpace] = [
      subnetFactory({ space: space.id, vlan: 1 }),
      subnetFactory({ space: null, vlan: 1 }),
    ];
    const pod = podDetailsFactory({ attached_vlans: [1], id: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = [space];
    state.subnet.items = [subnetInSpace, subnetNotInSpace];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);
    let links = [];
    let filteredLinks = [];

    // Click "Define" button
    await act(async () => {
      wrapper.find("[data-test='define-interfaces'] button").simulate("click");
    });
    wrapper.update();

    links = wrapper
      .find("SubnetSelect ContextualMenu")
      .prop("links") as MenuLink[];
    filteredLinks = links.filter((link) => typeof link !== "string");
    expect(filteredLinks.length).toBe(2);

    // Choose the space in state from the dropdown
    // Only the subnet in the selected space should be available
    await act(async () => {
      wrapper
        .find("FormikField[name='interfaces[0].space']")
        .props()
        .onChange({
          target: {
            name: "interfaces[0].space",
            value: `${space.id}`,
          },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();

    links = wrapper
      .find("SubnetSelect ContextualMenu")
      .prop("links") as MenuLink[];
    filteredLinks = links.filter((link) => typeof link !== "string");
    expect(filteredLinks.length).toBe(1);
  });

  it("shows an error if multiple interfaces defined without at least one PXE network", async () => {
    const fabric = fabricFactory();
    const space = spaceFactory();
    const pxeVlan = vlanFactory({ fabric: fabric.id, id: 1 });
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
    const wrapper = generateWrapper(store, pod);

    // Click "Define" button
    wrapper.find("[data-test='define-interfaces'] button").simulate("click");
    await waitForComponentToPaint(wrapper);

    // Add a second interface
    wrapper.find("[data-test='define-interfaces'] button").simulate("click");
    await waitForComponentToPaint(wrapper);

    // Select non-PXE network for the first interface
    wrapper.find("SubnetSelect button").at(0).simulate("click");
    await waitForComponentToPaint(wrapper);
    wrapper.find("ContextualMenuDropdown button").at(1).simulate("click");
    await waitForComponentToPaint(wrapper);

    // Select non-PXE network for the second interface - error should be present.
    wrapper.find("SubnetSelect button").at(1).simulate("click");
    await waitForComponentToPaint(wrapper);
    wrapper.find("ContextualMenuDropdown button").at(1).simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("[data-test='no-pxe']").text()).toBe(
      "Error: Select at least 1 PXE network when creating multiple interfaces."
    );

    // Select PXE network for the second interface - error should be removed.
    wrapper.find("SubnetSelect button").at(1).simulate("click");
    await waitForComponentToPaint(wrapper);
    wrapper.find("ContextualMenuDropdown button").at(0).simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("[data-test='no-pxe']").exists()).toBe(false);

    // Remove second interface with PXE network - error should still not show.
    wrapper.find("TableActions button").at(1).simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("[data-test='no-pxe']").exists()).toBe(false);
  });
});
