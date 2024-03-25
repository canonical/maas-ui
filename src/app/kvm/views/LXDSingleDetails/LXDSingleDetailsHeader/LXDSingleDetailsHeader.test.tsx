import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";

import { KVMSidePanelViews } from "@/app/kvm/constants";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("LXDSingleDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          factory.pod({
            id: 1,
            name: "pod-1",
            resources: factory.podResources({
              vm_count: factory.podVmCount({ tracked: 10 }),
            }),
            type: PodType.LXD,
          }),
        ],
        statuses: factory.podStatuses({
          1: factory.podStatus(),
        }),
      }),
    });
  });

  it("displays a spinner if pod hasn't loaded", () => {
    state.pod.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the LXD project", () => {
    state.pod.items[0].power_parameters = factory.podPowerParameters({
      project: "Manhattan",
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[3]).toHaveTextContent(
      "Manhattan"
    );
  });

  it("displays the tracked VMs count", () => {
    state.pod.items[0].resources = factory.podResources({
      vm_count: factory.podVmCount({ tracked: 5 }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "5 available"
    );
  });

  it("displays the pod's zone's name", () => {
    state.zone.items = [factory.zone({ id: 101, name: "danger" })];
    state.pod.items[0].zone = 101;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
      "danger"
    );
  });

  it("can open the refresh host form", async () => {
    state.zone.items = [factory.zone({ id: 101, name: "danger" })];
    state.pod.items[0].zone = 101;
    const setSidePanelContent = vi.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              setSidePanelContent={setSidePanelContent}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Refresh host" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.REFRESH_KVM,
      extras: { hostIds: [1] },
    });
  });
});
