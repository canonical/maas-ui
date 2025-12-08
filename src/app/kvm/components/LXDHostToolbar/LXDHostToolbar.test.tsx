import configureStore from "redux-mock-store";

import LXDHostToolbar from "./LXDHostToolbar";

import * as hooks from "@/app/base/hooks/analytics";
import urls from "@/app/base/urls";
import { ConfigNames } from "@/app/store/config/types";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  waitFor,
  screen,
  within,
  userEvent,
  renderWithProviders,
  setupMockServer,
} from "@/testing/utils";

const mockStore = configureStore();
setupMockServer(poolsResolvers.getPool.handler());

describe("LXDHostToolbar", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [
          factory.pod({
            id: 1,
            pool: 1,
            type: PodType.LXD,
          }),
        ],
      }),
    });
  });

  it("shows a spinner if pools haven't loaded yet", () => {
    const store = mockStore(state);
    renderWithProviders(
      <LXDHostToolbar hostId={1} setViewByNuma={vi.fn()} viewByNuma={false} />,
      { store }
    );

    expect(
      within(screen.getByTestId("pod-pool")).getByText("Loading")
    ).toBeInTheDocument();
  });

  it("can show the host's pool's name", async () => {
    const store = mockStore(state);
    renderWithProviders(
      <LXDHostToolbar hostId={1} setViewByNuma={vi.fn()} viewByNuma={false} />,
      { store }
    );
    await waitFor(() => {
      expect(screen.getByTestId("pod-pool").textContent).toEqual("swimming");
    });
  });

  it("can link to a host's settings page if in cluster view", () => {
    const store = mockStore(state);
    renderWithProviders(
      <LXDHostToolbar
        clusterId={2}
        hostId={1}
        setViewByNuma={vi.fn()}
        viewByNuma={false}
      />,
      { store }
    );

    expect(
      screen.getByTestId("settings-link").getAttribute("href")
    ).toStrictEqual(
      urls.kvm.lxd.cluster.host.edit({ clusterId: 2, hostId: 1 })
    );
  });

  it("does not show a link to host's settings page if in single host view", () => {
    const store = mockStore(state);
    renderWithProviders(
      <LXDHostToolbar hostId={1} setViewByNuma={vi.fn()} viewByNuma={false} />,
      { store }
    );

    expect(screen.queryByTestId("settings-link")).not.toBeInTheDocument();
  });

  it("shows tags in single host view", () => {
    const store = mockStore(state);
    renderWithProviders(
      <LXDHostToolbar hostId={1} setViewByNuma={vi.fn()} viewByNuma={false} />,
      { store }
    );

    expect(screen.getByTestId("pod-tags")).toBeInTheDocument();
  });

  it("shows NUMA view switch if LXD host includes data on at least one NUMA node", async () => {
    state.pod.items[0].resources = factory.podResources({
      numa: [factory.podNuma()],
    });
    const store = mockStore(state);
    renderWithProviders(
      <LXDHostToolbar hostId={1} setViewByNuma={vi.fn()} viewByNuma={false} />,
      { store }
    );
    await waitFor(() => {
      expect(screen.getByTestId("numa-switch")).toBeInTheDocument();
    });
  });

  it("can send an analytics event when toggling NUMA node view if analytics enabled", async () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.ENABLE_ANALYTICS,
            value: true,
          }),
        ],
      }),
      pod: factory.podState({
        items: [
          factory.pod({
            id: 1,
            resources: factory.podResources({ numa: [factory.podNuma()] }),
          }),
        ],
      }),
    });
    const useSendMock = vi.spyOn(hooks, "useSendAnalytics");
    const store = mockStore(state);
    renderWithProviders(
      <LXDHostToolbar hostId={1} setViewByNuma={vi.fn()} viewByNuma={false} />,
      { store }
    );
    await userEvent.click(screen.getByTestId("numa-switch"));
    await waitFor(() => {
      expect(useSendMock).toHaveBeenCalled();
    });
    useSendMock.mockRestore();
  });

  it("can display a basic set of data", () => {
    const store = mockStore(state);
    renderWithProviders(<LXDHostToolbar hostId={1} showBasic />, { store });

    expect(screen.getByTestId("toolbar-title")).toBeInTheDocument();
    expect(screen.getByTestId("lxd-version")).toBeInTheDocument();
    expect(screen.queryByTestId("settings-link")).toBeNull();
    expect(screen.queryByTestId("pod-pool")).toBeNull();
    expect(screen.queryByTestId("pod-tags")).toBeNull();
    expect(screen.queryByTestId("numa-switch")).toBeNull();
    expect(screen.queryByTestId("add-virtual-machine")).toBeNull();
  });
});
