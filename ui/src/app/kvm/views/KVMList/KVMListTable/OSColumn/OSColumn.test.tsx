import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { nodeStatus } from "app/base/enum";
import OSColumn from "./OSColumn";

const mockStore = configureStore();

describe("OSColumn", () => {
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
            id: 1,
            name: "pod-1",
          },
        ],
      },
    };
  });

  it(`shows a spinner if machines/controllers are loading and pod's host is not
    yet in state`, () => {
    const state = { ...initialState };
    state.machine.loading = true;
    state.pod.items[0].host = "abc123";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OSColumn id={1} />
      </Provider>
    );
    expect(wrapper.find(".p-icon--spinner").exists()).toBe(true);
  });

  it("can display the pod's host OS information", () => {
    const state = { ...initialState };
    state.machine.items = [
      {
        distro_series: "focal",
        osystem: "ubuntu",
        status_code: nodeStatus.DEPLOYED,
        system_id: "abc123",
      },
    ];
    state.pod.items = [{ host: "abc123", id: 1, name: "pod-1" }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OSColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-os']").text()).toBe(
      "Ubuntu 20.04 LTS"
    );
  });

  it("displays 'Unknown' if pod's host cannot be found", () => {
    const state = { ...initialState };
    state.machine.items = [
      {
        distro_series: "focal",
        osystem: "ubuntu",
        status_code: nodeStatus.DEPLOYED,
        system_id: "abc123",
      },
    ];
    state.pod.items = [{ host: "def456", id: 1, name: "pod-1" }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OSColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-os']").text()).toBe("Unknown");
  });
});
