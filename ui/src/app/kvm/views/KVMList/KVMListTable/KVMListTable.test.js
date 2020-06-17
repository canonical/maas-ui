import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import KVMListTable from "./KVMListTable";

const mockStore = configureStore();

describe("KVMListTable", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      controller: {
        loaded: true,
        loading: false,
        items: [],
      },
      general: {
        osInfo: {
          loaded: true,
          loading: false,
          data: {
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
              ["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"'],
            ],
          },
        },
      },
      machine: {
        loaded: true,
        loading: false,
        items: [],
      },
      pod: {
        items: [
          {
            cpu_over_commit_ratio: 1,
            composed_machines_count: 10,
            id: 1,
            memory_over_commit_ratio: 1,
            name: "pod-1",
            owners_count: 5,
            pool: 1,
            total: {
              cores: 8,
              local_storage: 1000000000000,
              memory: 8192,
            },
            type: "virsh",
            used: {
              cores: 4,
              local_storage: 100000000000,
              memory: 2048,
            },
            zone: 1,
          },
        ],
      },
      resourcepool: {
        items: [
          {
            id: 1,
            name: "swimming-pool",
          },
        ],
      },
      zone: {
        items: [
          {
            id: 1,
            name: "alone-zone",
          },
        ],
      },
    };
  });

  it("correctly fetches the necessary data", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "FETCH_CONTROLLER",
      "FETCH_GENERAL_OSINFO",
      "FETCH_MACHINE",
      "FETCH_POD",
      "FETCH_RESOURCEPOOL",
      "FETCH_ZONE",
    ];
    const actualActions = store.getActions();
    expect(
      actualActions.every((action) => expectedActions.includes(action.type))
    ).toBe(true);
  });
});
