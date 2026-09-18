import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";

import RefreshForm from "@/app/kvm/components/RefreshForm";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
  mockSidePanel,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();
const mockServer = setupMockServer(
  zoneResolvers.getZone.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

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
    renderWithProviders(<LXDSingleDetailsHeader id={1} />, {
      state,
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the LXD project", () => {
    state.pod.items[0].power_parameters = factory.podPowerParameters({
      project: "Manhattan",
    });
    renderWithProviders(<LXDSingleDetailsHeader id={1} />, {
      state,
    });

    expect(screen.getAllByTestId("block-subtitle")[3]).toHaveTextContent(
      "Manhattan"
    );
  });

  it("displays the tracked VMs count", () => {
    state.pod.items[0].resources = factory.podResources({
      vm_count: factory.podVmCount({ tracked: 5 }),
    });
    renderWithProviders(<LXDSingleDetailsHeader id={1} />, {
      state,
    });

    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "5 available"
    );
  });

  it("displays the pod's zone's name", async () => {
    state.pod.items[0].zone = 1;
    renderWithProviders(<LXDSingleDetailsHeader id={1} />, {
      state,
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
        "zone-1"
      );
    });
  });

  it("can open the refresh host form", async () => {
    state.pod.items[0].zone = 1;
    renderWithProviders(<LXDSingleDetailsHeader id={1} />, {
      state,
    });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Refresh host" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Refresh host" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: RefreshForm,
      title: "Refresh",
      props: { hostIds: [1] },
    });
  });

  it("disables the refresh host button without the edit machines entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    state.pod.items[0].zone = 1;
    renderWithProviders(<LXDSingleDetailsHeader id={1} />, {
      state,
    });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Refresh host" })
      ).toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Refresh host" }));

    expect(mockOpen).not.toHaveBeenCalled();
  });
});
