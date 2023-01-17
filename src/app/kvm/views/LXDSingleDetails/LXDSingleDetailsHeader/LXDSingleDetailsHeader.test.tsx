import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";

import { KVMHeaderViews } from "app/kvm/constants";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  podVmCount as podVmCountFactory,
  zone as zoneFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("LXDSingleDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          podFactory({
            id: 1,
            name: "pod-1",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 10 }),
            }),
            type: PodType.LXD,
          }),
        ],
        statuses: podStatusesFactory({
          1: podStatusFactory(),
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
            <LXDSingleDetailsHeader
              id={1}
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the LXD project", () => {
    state.pod.items[0].power_parameters = powerParametersFactory({
      project: "Manhattan",
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[3]).toHaveTextContent(
      "Manhattan"
    );
  });

  it("displays the tracked VMs count", () => {
    state.pod.items[0].resources = podResourcesFactory({
      vm_count: podVmCountFactory({ tracked: 5 }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "5 available"
    );
  });

  it("displays the pod's zone's name", () => {
    state.zone.items = [zoneFactory({ id: 101, name: "danger" })];
    state.pod.items[0].zone = 101;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
      "danger"
    );
  });

  it("can open the refresh host form", async () => {
    state.zone.items = [zoneFactory({ id: 101, name: "danger" })];
    state.pod.items[0].zone = 101;
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              setSearchFilter={jest.fn()}
              setSidePanelContent={setSidePanelContent}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Refresh host" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.REFRESH_KVM,
      extras: { hostIds: [1] },
    });
  });
});
