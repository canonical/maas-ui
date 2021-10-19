import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDVMsTable from "../LXDVMsTable";

import LXDHostVMs from "./LXDHostVMs";

import { PodType } from "app/store/pod/constants";
import {
  machine as machineFactory,
  pod as podFactory,
  podNuma as podNumaFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVM as podVMFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("LXDHostVMs", () => {
  it("shows a spinner if pod has not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDHostVMs
            hostId={1}
            onRefreshClick={jest.fn()}
            searchFilter=""
            setSearchFilter={jest.fn()}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can get resources for a VM", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({
              vms: [
                podVMFactory({
                  hugepages_backed: true,
                  pinned_cores: [3],
                  system_id: "abc123",
                  unpinned_cores: 8,
                }),
              ],
            }),
            type: PodType.LXD,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDHostVMs
            hostId={1}
            onRefreshClick={jest.fn()}
            searchFilter=""
            setSearchFilter={jest.fn()}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find(LXDVMsTable).invoke("getResources")(
        machineFactory({ system_id: "abc123" })
      )
    ).toStrictEqual({
      hugepagesBacked: true,
      pinnedCores: [3],
      unpinnedCores: 8,
    });
  });

  it("can view resources by NUMA node", async () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({ numa: [podNumaFactory()] }),
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <LXDHostVMs
            hostId={1}
            onRefreshClick={jest.fn()}
            searchFilter=""
            setSearchFilter={jest.fn()}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("input[data-test='numa-switch']").exists()).toBe(true);
    expect(wrapper.find("LXDVMsSummaryCard").exists()).toBe(true);
    expect(wrapper.find("NumaResources").exists()).toBe(false);

    wrapper
      .find("input[data-test='numa-switch']")
      .simulate("change", { target: { checked: true } });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("LXDVMsSummaryCard").exists()).toBe(false);
    expect(wrapper.find("NumaResources").exists()).toBe(true);
  });
});
