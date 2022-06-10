import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDHostToolbar from "../LXDHostToolbar";
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
          <CompatRouter>
            <LXDHostVMs
              hostId={1}
              onRefreshClick={jest.fn()}
              searchFilter=""
              setSearchFilter={jest.fn()}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
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
          <CompatRouter>
            <LXDHostVMs
              hostId={1}
              onRefreshClick={jest.fn()}
              searchFilter=""
              setSearchFilter={jest.fn()}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
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
          <CompatRouter>
            <LXDHostVMs
              hostId={1}
              onRefreshClick={jest.fn()}
              searchFilter=""
              setSearchFilter={jest.fn()}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("input[data-testid='numa-switch']").exists()).toBe(
      true
    );
    expect(wrapper.find("LXDVMsSummaryCard").exists()).toBe(true);
    expect(wrapper.find("NumaResources").exists()).toBe(false);

    wrapper
      .find("input[data-testid='numa-switch']")
      .simulate("change", { target: { checked: true } });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("LXDVMsSummaryCard").exists()).toBe(false);
    expect(wrapper.find("NumaResources").exists()).toBe(true);
  });

  it("displays the host name when in a cluster", async () => {
    const pod = podFactory({ id: 1, name: "cluster host" });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDHostVMs
              clusterId={2}
              hostId={1}
              onRefreshClick={jest.fn()}
              searchFilter=""
              setSearchFilter={jest.fn()}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const title = wrapper.find(LXDHostToolbar).prop("title");
    expect(title && title.includes(pod.name)).toBe(true);
  });

  it("does not display the host name when in a single host", async () => {
    const pod = podFactory({ id: 1, name: "cluster host" });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDHostVMs
              hostId={1}
              onRefreshClick={jest.fn()}
              searchFilter=""
              setSearchFilter={jest.fn()}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const title = wrapper.find(LXDHostToolbar).prop("title");
    expect(title && title.includes(pod.name)).toBe(false);
  });
});
