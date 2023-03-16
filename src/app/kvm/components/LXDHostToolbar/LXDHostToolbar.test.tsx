import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDHostToolbar from "./LXDHostToolbar";

import * as hooks from "app/base/hooks/analytics";
import urls from "app/base/urls";
import { ConfigNames } from "app/store/config/types";
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
import { waitFor, render, screen, within, userEvent } from "testing/utils";

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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.kvm.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setSidePanelContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      within(screen.getByTestId("pod-pool")).getByText("Loading")
    ).toBeInTheDocument();
  });

  it("can show the host's pool's name", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.kvm.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setSidePanelContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("pod-pool").textContent).toEqual("swimming");
  });

  it("can link to a host's settings page if in cluster view", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.vms.host({
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
              setSidePanelContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByTestId("settings-link").getAttribute("href")
    ).toStrictEqual(
      urls.kvm.lxd.cluster.host.edit({ clusterId: 2, hostId: 1 })
    );
  });

  it("does not show a link to host's settings page if in single host view", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.kvm.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setSidePanelContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId("settings-link")).not.toBeInTheDocument();
  });

  it("shows tags in single host view", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.kvm.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setSidePanelContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("pod-tags")).toBeInTheDocument();
  });

  it("shows NUMA view switch if LXD host includes data on at least one NUMA node", async () => {
    state.pod.items[0].resources = podResourcesFactory({
      numa: [podNumaFactory()],
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setSidePanelContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("numa-switch")).toBeInTheDocument()
    );
  });

  it("can send an analytics event when toggling NUMA node view if analytics enabled", async () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.ENABLE_ANALYTICS,
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
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDHostToolbar
              hostId={1}
              setSidePanelContent={jest.fn()}
              setViewByNuma={jest.fn()}
              viewByNuma={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    userEvent.click(screen.getByTestId("numa-switch"));
    await waitFor(() => expect(useSendMock).toHaveBeenCalled());
    useSendMock.mockRestore();
  });

  it("can display a basic set of data", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.kvm.lxd.single.vms({ id: 1 }), key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LXDHostToolbar hostId={1} showBasic />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("toolbar-title")).toBeInTheDocument();
    expect(screen.getByTestId("lxd-version")).toBeInTheDocument();
    expect(screen.queryByTestId("settings-link")).toBeNull();
    expect(screen.queryByTestId("pod-pool")).toBeNull();
    expect(screen.queryByTestId("pod-tags")).toBeNull();
    expect(screen.queryByTestId("numa-switch")).toBeNull();
    expect(screen.queryByTestId("add-virtual-machine")).toBeNull();
  });
});
