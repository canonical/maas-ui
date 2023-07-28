import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useIsDHCPEnabled, useCanBeDeleted } from "./hooks";

import {
  subnetDetails as subnetFactory,
  subnetIP as subnetIPFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  vlan as vlanFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

describe("useCanBeDeleted", () => {
  it("can be deleted if DHCP is disabled and the subnet has no ips", () => {
    const vlan = vlanFactory({ dhcp_on: false });
    const subnet = subnetFactory({
      ip_addresses: [],
      vlan: vlan.id,
    });
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnet],
      }),
      vlan: vlanStateFactory({
        items: [vlan],
      }),
    });
    const store = mockStore(state);
    const { result } = renderHook(() => useCanBeDeleted(subnet.id), {
      wrapper: generateWrapper(store),
    });
    expect(result.current).toBe(true);
  });

  it("cannot be deleted if DHCP is enabled", () => {
    const vlan = vlanFactory({ dhcp_on: true });
    const subnet = subnetFactory({
      vlan: vlan.id,
    });
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnet],
      }),
      vlan: vlanStateFactory({
        items: [vlan],
      }),
    });
    const store = mockStore(state);
    const { result } = renderHook(() => useCanBeDeleted(subnet.id), {
      wrapper: generateWrapper(store),
    });
    expect(result.current).toBe(true);
  });

  it("cannot be deleted if DHCP is disabled but the subnet has ips", () => {
    const vlan = vlanFactory({ dhcp_on: false });
    const subnet = subnetFactory({
      ip_addresses: [subnetIPFactory()],
      vlan: vlan.id,
    });
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnet],
      }),
      vlan: vlanStateFactory({
        items: [vlan],
      }),
    });
    const store = mockStore(state);
    const { result } = renderHook(() => useCanBeDeleted(subnet.id), {
      wrapper: generateWrapper(store),
    });
    expect(result.current).toBe(true);
  });
});

describe("useIsDHCPEnabled", () => {
  it("is enabled if the subnet's VLAN has DHCP turned on", () => {
    const vlan = vlanFactory({ dhcp_on: true });
    const subnet = subnetFactory({
      vlan: vlan.id,
    });
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnet],
      }),
      vlan: vlanStateFactory({
        items: [vlan],
      }),
    });
    const store = mockStore(state);
    const { result } = renderHook(() => useIsDHCPEnabled(subnet.id), {
      wrapper: generateWrapper(store),
    });
    expect(result.current).toBe(true);
  });

  it("is disabled if the subnet's VLAN has DHCP turned off", () => {
    const vlan = vlanFactory({ dhcp_on: false });
    const subnet = subnetFactory({
      vlan: vlan.id,
    });
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnet],
      }),
      vlan: vlanStateFactory({
        items: [vlan],
      }),
    });
    const store = mockStore(state);
    const { result } = renderHook(() => useIsDHCPEnabled(subnet.id), {
      wrapper: generateWrapper(store),
    });
    expect(result.current).toBe(false);
  });
});
