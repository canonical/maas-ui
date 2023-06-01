import VirshDetailsHeader from "./VirshDetailsHeader";

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
  rootState as rootStateFactory,
  zone as zoneFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("VirshDetailsHeader", () => {
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
    renderWithBrowserRouter(
      <VirshDetailsHeader
        id={1}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { route: "/kvm/1", state }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays the virsh power address", () => {
    state.pod.items[0].power_parameters = powerParametersFactory({
      power_address: "qemu+ssh://ubuntu@192.168.1.1/system",
    });
    renderWithBrowserRouter(
      <VirshDetailsHeader
        id={1}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { route: "/kvm/1/resources", state }
    );
    expect(screen.getAllByTestId("block-subtitle")[0]).toHaveTextContent(
      "qemu+ssh://ubuntu@192.168.1.1/system"
    );
  });

  it("displays the tracked VMs count", () => {
    state.pod.items[0].resources = podResourcesFactory({
      vm_count: podVmCountFactory({ tracked: 5 }),
    });
    renderWithBrowserRouter(
      <VirshDetailsHeader
        id={1}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { route: "/kvm/1/resources", state }
    );
    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "5 available"
    );
  });

  it("displays the pod zone name", () => {
    state.zone.items = [zoneFactory({ id: 101, name: "danger" })];
    state.pod.items[0].zone = 101;
    renderWithBrowserRouter(
      <VirshDetailsHeader
        id={1}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { route: "/kvm/1/resources", state }
    );
    expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
      "danger"
    );
  });
});
