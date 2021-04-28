import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LxdTable from "./LxdTable";

import { PodType } from "app/store/pod/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LxdTable", () => {
  it("can group lxd pods by power address", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            power_address: "172.0.0.1",
            type: PodType.LXD,
          }),
          podFactory({
            power_address: "172.0.0.1",
            type: PodType.LXD,
          }),
          podFactory({
            power_address: "192.168.1.1",
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdTable />
        </MemoryRouter>
      </Provider>
    );
    const getLxdAddress = (rowNumber: number) =>
      wrapper
        .find("tbody TableRow")
        .at(rowNumber)
        .find("[data-test='lxd-address']");

    expect(getLxdAddress(0).text()).toBe("172.0.0.1");
    // Second address cell should be empty because it's in the group above.
    expect(getLxdAddress(1).exists()).toBe(false);
    expect(getLxdAddress(2).text()).toBe("192.168.1.1");
  });

  it("can update the LXD server sort order", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            power_address: "172.0.0.1",
            type: PodType.LXD,
          }),
          podFactory({
            power_address: "0.0.0.0",
            type: PodType.LXD,
          }),
          podFactory({
            power_address: "192.168.1.1",
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdTable />
        </MemoryRouter>
      </Provider>
    );
    const getLxdAddress = (rowNumber: number) =>
      wrapper
        .find("tbody TableRow")
        .at(rowNumber)
        .find("[data-test='lxd-address']");

    // Sorted ascending by address by default
    expect(getLxdAddress(0).text()).toBe("0.0.0.0");
    expect(getLxdAddress(1).text()).toBe("172.0.0.1");
    expect(getLxdAddress(2).text()).toBe("192.168.1.1");

    // Change to sort descending by address
    wrapper.find("[data-test='address-header'] button").simulate("click");
    expect(getLxdAddress(0).text()).toBe("192.168.1.1");
    expect(getLxdAddress(1).text()).toBe("172.0.0.1");
    expect(getLxdAddress(2).text()).toBe("0.0.0.0");

    // Change to no sort
    wrapper.find("[data-test='address-header'] button").simulate("click");
    expect(getLxdAddress(0).text()).toBe("172.0.0.1");
    expect(getLxdAddress(1).text()).toBe("0.0.0.0");
    expect(getLxdAddress(2).text()).toBe("192.168.1.1");
  });

  it("can update the LXD project sort order", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        // There are two groups with two pods each
        items: [
          podFactory({
            name: "pod-2",
            power_address: "172.0.0.1",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-3",
            power_address: "192.168.1.1",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-4",
            power_address: "192.168.1.1",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-1",
            power_address: "172.0.0.1",
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdTable />
        </MemoryRouter>
      </Provider>
    );
    const getLxdName = (rowNumber: number) =>
      wrapper
        .find("tbody TableRow")
        .at(rowNumber)
        .find("[data-test='pod-name']");

    // Sorted ascending by name by default
    expect(getLxdName(0).text()).toBe("pod-1");
    expect(getLxdName(1).text()).toBe("pod-2");
    expect(getLxdName(2).text()).toBe("pod-3");
    expect(getLxdName(3).text()).toBe("pod-4");

    // Change to sort descending by name. Groups themselves are not sorted so
    // only the LXD pods in each group should be sorted.
    wrapper.find("[data-test='name-header'] button").simulate("click");
    expect(getLxdName(0).text()).toBe("pod-2");
    expect(getLxdName(1).text()).toBe("pod-1");
    expect(getLxdName(2).text()).toBe("pod-4");
    expect(getLxdName(3).text()).toBe("pod-3");

    // Change to no sort
    wrapper.find("[data-test='name-header'] button").simulate("click");
    expect(getLxdName(0).text()).toBe("pod-2");
    expect(getLxdName(1).text()).toBe("pod-1");
    expect(getLxdName(2).text()).toBe("pod-3");
    expect(getLxdName(3).text()).toBe("pod-4");
  });
});
