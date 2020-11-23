import React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore, { MockStore } from "redux-mock-store";

import ComposeForm from "../ComposeForm";

import {
  domainState as domainStateFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStoragePool as podStoragePoolFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

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

describe("StorageTable", () => {
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

  it("disables add disk button with tooltip if KVM type is LXD", () => {
    const pod = podDetailsFactory({ id: 1, type: "lxd" });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(wrapper.find("[data-test='add-disk'] button").prop("disabled")).toBe(
      true
    );
    expect(wrapper.find("[data-test='add-disk']").prop("message")).toBe(
      "For the Beta version of LXD VM hosts each VM can only be assigned a single block device."
    );
  });

  it("disables add disk button if pod is composing a machine", () => {
    const pod = podDetailsFactory({ id: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.pod.statuses = { [pod.id]: podStatusFactory({ composing: true }) };
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(wrapper.find("[data-test='add-disk'] button").prop("disabled")).toBe(
      true
    );
  });

  it("can add disks and remove all but last disk if KVM type is not LXD", async () => {
    const pod = podDetailsFactory({ id: 1, type: "virsh" });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // One disk should display by default and cannot be deleted
    expect(wrapper.find("StorageTable tbody TableRow").length).toBe(1);
    expect(
      wrapper.find("[data-test='remove-disk'] button").prop("disabled")
    ).toBe(true);

    // Click "Add disk" - another disk should be added, and remove button should enable
    await act(async () => {
      wrapper.find("[data-test='add-disk'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("StorageTable tbody TableRow").length).toBe(2);
    expect(
      wrapper.find("[data-test='remove-disk'] button").at(0).prop("disabled")
    ).toBe(false);

    // Click delete button - a disk should be removed
    await act(async () => {
      wrapper.find("[data-test='remove-disk'] button").at(0).simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("StorageTable tbody TableRow").length).toBe(1);
    expect(
      wrapper.find("[data-test='remove-disk'] button").prop("disabled")
    ).toBe(true);
  });

  it("displays a caution message if disk size is less than 8GB", async () => {
    const pod = podDetailsFactory({ id: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Change the disk size to below 8
    await act(async () => {
      wrapper
        .find("input[name='disks[0].size']")
        .props()
        .onChange({
          target: { name: "disks[0].size", value: "4" },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();

    expect(
      wrapper
        .find("FormikField[name='disks[0].size'] .p-form-validation__message")
        .text()
    ).toBe("Caution: Ubuntu typically requires 8GB minimum.");
  });

  it("displays an error message if disk size is higher than available storage in pool", async () => {
    const pool = podStoragePoolFactory({ available: 20000000000 }); // 20GB
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Change the disk size to above 20GB
    await act(async () => {
      wrapper
        .find("input[name='disks[0].size']")
        .props()
        .onChange({
          target: { name: "disks[0].size", value: "21" },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();
    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      `Error: Only 20GB available in ${pool.name}.`
    );
  });

  it(`displays an error message if the sum of disk sizes from a pool is higher
    than the available storage in that pool`, async () => {
    const pool = podStoragePoolFactory({ available: 25000000000 }); // 25GB
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
      type: "virsh",
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Add a disk
    await act(async () => {
      wrapper.find("[data-test='add-disk'] button").simulate("click");
    });
    wrapper.update();

    // Change the first disk size to 15GB
    await act(async () => {
      wrapper
        .find("input[name='disks[0].size']")
        .props()
        .onChange({
          target: { name: "disks[0].size", value: "15" },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();

    // Change the second disk size to 11GB
    await act(async () => {
      wrapper
        .find("input[name='disks[1].size']")
        .props()
        .onChange({
          target: { name: "disks[1].size", value: "11" },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();

    // Each is lower than 25GB, but the sum is higher, so an error should show
    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      `Error: Only 25GB available in ${pool.name}.`
    );
  });

  it("only shows an option for local storage if pod is an RSD without iSCSI capabilities", () => {
    const pod = podDetailsFactory({
      capabilities: [],
      id: 1,
      type: "rsd",
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(wrapper.find("select[name='disks[0].location'] option").length).toBe(
      1
    );
    expect(
      wrapper
        .find("select[name='disks[0].location'] option")
        .at(0)
        .prop("value")
    ).toBe("local");
  });

  it("shows options for local and iSCSI storage if pod is an RSD with iSCSI capabilities", () => {
    const pod = podDetailsFactory({
      capabilities: ["iscsi_storage"],
      id: 1,
      type: "rsd",
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    expect(wrapper.find("select[name='disks[0].location'] option").length).toBe(
      2
    );
    expect(
      wrapper
        .find("select[name='disks[0].location'] option")
        .at(0)
        .prop("value")
    ).toBe("local");
    expect(
      wrapper
        .find("select[name='disks[0].location'] option")
        .at(1)
        .prop("value")
    ).toBe("iscsi");
  });
});
