import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VirshDetailsHeader from "./VirshDetailsHeader";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  podVmCount as podVmCountFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("VirshDetailsHeader", () => {
  let state;

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
            type: PodType.VIRSH,
          }),
        ],
        statuses: podStatusesFactory({
          1: podStatusFactory(),
        }),
      }),
    });
  });

  it("displays a spinner if pod has not loaded", () => {
    state.pod.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <VirshDetailsHeader
          id={1}
          setSidePanelContent={jest.fn()}
          sidePanelContent={null}
        />
      </Provider>,
      { route: "/kvm/1" }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays the virsh power address", () => {
    state.pod.items[0].power_parameters = powerParametersFactory({
      power_address: "qemu+ssh://ubuntu@192.168.1.1/system",
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <VirshDetailsHeader
          id={1}
          setSidePanelContent={jest.fn()}
          sidePanelContent={null}
        />
      </Provider>,
      { route: "/kvm/1/resources" }
    );
    expect(
      screen.getByText(/qemu\+ssh:\/\/ubuntu@192\.168\.1\.1\/system/i)
    ).toBeInTheDocument();
  });

  it("displays the tracked VMs count", () => {
    state.pod.items[0].resources = podResourcesFactory({
      vm_count: podVmCountFactory({ tracked: 5 }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <VirshDetailsHeader
          id={1}
          setSidePanelContent={jest.fn()}
          sidePanelContent={null}
        />
      </Provider>,
      { route: "/kvm/1/resources" }
    );
    expect(screen.getByText(/5 available/i)).toBeInTheDocument();
  });

  it("displays the pod zone name", () => {
    state.zone.items = [zoneFactory({ id: 101, name: "danger" })];
    state.pod.items[0].zone = 101;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <VirshDetailsHeader
          id={1}
          setSidePanelContent={jest.fn()}
          sidePanelContent={null}
        />
      </Provider>,
      { route: "/kvm/1/resources" }
    );
    expect(screen.getByText(/danger/i)).toBeInTheDocument();
  });
});
