import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import * as hooks from "app/base/hooks";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import MachineStorage from "./MachineStorage";
import { act } from "react-dom/test-utils";

const mockStore = configureStore();

describe("MachineStorage", () => {
  it("displays a spinner if machine is loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineStorage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("renders a list of cache sets if any exist", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [diskFactory({ name: "quiche-cache", type: "cache-set" })],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/storage", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/storage"
            component={() => <MachineStorage />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("CacheSetsTable").exists()).toBe(true);
    expect(wrapper.find("CacheSetsTable [data-test='name']").at(0).text()).toBe(
      "quiche-cache"
    );
  });

  it("renders a list of datastores if any exist", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            disks: [
              diskFactory({
                filesystem: fsFactory({
                  fstype: "vmfs6",
                  mount_point: "/path",
                }),
                name: "datastore1",
                size: 100,
              }),
            ],
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/storage", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/storage"
            component={() => <MachineStorage />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("DatastoresTable").exists()).toBe(true);
    expect(
      wrapper.find("DatastoresTable [data-test='name']").at(0).text()
    ).toBe("datastore1");
  });

  it("renders storage layout dropdown if machine's storage can be edited", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/storage", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/storage"
            component={() => <MachineStorage />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ChangeStorageLayout").exists()).toBe(true);
  });

  it("sends an analytics event when clicking on the MAAS docs footer link", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = (hooks.useSendAnalytics = jest.fn(
      () => mockSendAnalytics
    ));
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/storage", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/storage"
            component={() => <MachineStorage />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("[data-test='docs-footer-link']").simulate("click");
    });
    wrapper.update();

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine storage",
      "Click link to MAAS docs",
      "Windows",
    ]);

    mockUseSendAnalytics.mockRestore();
  });
});
