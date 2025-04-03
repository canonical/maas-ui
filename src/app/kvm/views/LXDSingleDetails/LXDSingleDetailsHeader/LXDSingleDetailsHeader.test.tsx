import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";

import { KVMSidePanelViews } from "@/app/kvm/constants";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  userEvent,
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(zoneResolvers.getZone.handler());

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
    renderWithBrowserRouter(
      <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      { route: "/kvm/1/resources", state }
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the LXD project", () => {
    state.pod.items[0].power_parameters = factory.podPowerParameters({
      project: "Manhattan",
    });
    renderWithBrowserRouter(
      <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      { route: "/kvm/1/resources", state }
    );

    expect(screen.getAllByTestId("block-subtitle")[3]).toHaveTextContent(
      "Manhattan"
    );
  });

  it("displays the tracked VMs count", () => {
    state.pod.items[0].resources = factory.podResources({
      vm_count: factory.podVmCount({ tracked: 5 }),
    });
    renderWithBrowserRouter(
      <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      { route: "/kvm/1/resources", state }
    );

    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "5 available"
    );
  });

  it("displays the pod's zone's name", async () => {
    state.pod.items[0].zone = 1;
    renderWithBrowserRouter(
      <LXDSingleDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      { route: "/kvm/1/resources", state }
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
        "zone-1"
      );
    });
  });

  it("can open the refresh host form", async () => {
    state.pod.items[0].zone = 1;
    const setSidePanelContent = vi.fn();
    renderWithBrowserRouter(
      <LXDSingleDetailsHeader
        id={1}
        setSidePanelContent={setSidePanelContent}
      />,
      { route: "/kvm/1/resources", state }
    );
    await userEvent.click(screen.getByRole("button", { name: "Refresh host" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.REFRESH_KVM,
      extras: { hostIds: [1] },
    });
  });
});
