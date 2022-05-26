import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDHostToolbar from "./LXDHostToolbar";

import * as hooks from "app/base/hooks/analytics";
import { KVMHeaderViews } from "app/kvm/constants";
import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  pod as podFactory,
  podNuma as podNumaFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("LXDHostToolbar", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            pool: 2,
            type: PodType.LXD,
          }),
        ],
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory({ id: 2, name: "swimming" })],
      }),
    });
  });

  it("shows a spinner if pools haven't loaded yet", () => {
    state.resourcepool.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: kvmURLs.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setHeaderContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='pod-pool'] Spinner").exists()).toBe(
      true
    );
  });

  it("can show the host's pool's name", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: kvmURLs.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setHeaderContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='pod-pool']").text()).toBe("swimming");
  });

  it("can link to a host's settings page if in cluster view", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.vms.host({
                clusterId: 2,
                hostId: 1,
              }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              clusterId={2}
              hostId={1}
              setHeaderContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("Link[data-testid='settings-link']").prop("to")
    ).toStrictEqual({
      pathname: kvmURLs.lxd.cluster.host.edit({ clusterId: 2, hostId: 1 }),
    });
    expect(
      wrapper.find("Link[data-testid='settings-link']").prop("state")
    ).toStrictEqual({
      from: kvmURLs.lxd.cluster.vms.host({
        clusterId: 2,
        hostId: 1,
      }),
    });
  });

  it("does not show a link to host's settings page if in single host view", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: kvmURLs.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setHeaderContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='settings-link']").exists()).toBe(false);
  });

  it("shows tags in single host view", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: kvmURLs.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setHeaderContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='pod-tags']").exists()).toBe(true);
  });

  it("can open the compose VM form", () => {
    const setHeaderContent = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: kvmURLs.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setHeaderContent={setHeaderContent}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("button[data-testid='add-virtual-machine']").simulate("click");

    expect(setHeaderContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.COMPOSE_VM,
      extras: {
        hostId: 1,
      },
    });
  });

  it("shows NUMA view switch if LXD host includes data on at least one NUMA node", async () => {
    state.pod.items[0].resources = podResourcesFactory({
      numa: [podNumaFactory()],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setHeaderContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("input[data-testid='numa-switch']").exists()).toBe(
      true
    );
  });

  it("can send an analytics event when toggling NUMA node view if analytics enabled", async () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "enable_analytics",
            value: true,
          }),
        ],
      }),
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({ numa: [podNumaFactory()] }),
          }),
        ],
      }),
    });
    const useSendMock = jest.spyOn(hooks, "useSendAnalytics");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setHeaderContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("input[data-testid='numa-switch']")
      .simulate("change", { target: { checked: true } });
    await waitForComponentToPaint(wrapper);

    expect(useSendMock).toHaveBeenCalled();
    useSendMock.mockRestore();
  });

  it("can display a basic set of data", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: kvmURLs.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar hostId={1} showBasic />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='toolbar-title']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='lxd-version']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='settings-link']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='pod-pool']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='pod-tags']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='numa-switch']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='add-virtual-machine']").exists()).toBe(
      false
    );
  });
});
