import { NetworkDiscoverySidePanelViews } from "../constants";

import DiscoveriesList, {
  Labels as DiscoveriesListLabels,
} from "./DiscoveriesList";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "@/app/store/types/node";
import {
  discovery as discoveryFactory,
  domain as domainFactory,
  device as deviceFactory,
  machine as machineFactory,
  testStatus as testStatusFactory,
  modelRef as modelRefFactory,
  discoveryState as discoveryStateFactory,
  deviceState as deviceStateFactory,
  domainState as domainStateFactory,
  machineState as machineStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithBrowserRouter,
} from "@/testing/utils";

const route = "/network-discovery";
describe("DiscoveriesList", () => {
  let state: RootState;

  const setSidePanelContent = vi.fn();
  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
    vi.spyOn(query, "generateCallId").mockReturnValueOnce("123456");
    const machines = [
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 4,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.RUNNING,
        }),
        distro_series: "bionic",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "koala.example",
        hostname: "koala",
        ip_addresses: [],
        memory: 8,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        osystem: "ubuntu",
        owner: "admin",
        permissions: ["edit", "delete"],
        physical_disk_count: 1,
        pool: modelRefFactory(),
        pxe_mac: "00:11:22:33:44:55",
        spaces: [],
        status: NodeStatus.DEPLOYED,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 8,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        testing_status: TestStatusStatus.PASSED,
        system_id: "abc123",
        zone: modelRefFactory(),
      }),
    ];
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
      machine: machineStateFactory({
        items: machines,
        lists: {
          123456: machineStateListFactory({
            groups: [
              machineStateListGroupFactory({
                items: [machines[0].system_id],
              }),
            ],
            loading: false,
            loaded: true,
          }),
        },
        loaded: true,
      }),
      device: deviceStateFactory({
        loaded: true,
        items: [deviceFactory({ system_id: "abc123", fqdn: "abc123.example" })],
      }),
      subnet: subnetStateFactory({ loaded: true }),
      vlan: vlanStateFactory({ loaded: true }),
      domain: domainStateFactory({
        loaded: true,
        items: [domainFactory({ name: "local" })],
      }),
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("displays the discoveries", () => {
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      state,
    });

    expect(screen.getByText("my-discovery-test")).toBeInTheDocument();
    expect(screen.getByText("another-test")).toBeInTheDocument();
  });

  it("displays a spinner within table when loading", () => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loading: true,
      }),
    });
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      state,
    });
    expect(screen.getByText(DiscoveriesListLabels.Loading)).toBeInTheDocument();
  });

  it("displays a message when there are no discoveries", () => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [],
      }),
    });
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      state,
    });
    expect(
      screen.getByText(DiscoveriesListLabels.NoNewDiscoveries)
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(DiscoveriesListLabels.DiscoveriesList)
    ).not.toBeInTheDocument();
  });

  it("can trigger the add form sidepanel", async () => {
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      state,
    });
    const row = screen.getByRole("row", { name: "my-discovery-test" });
    await userEvent.click(
      within(within(row).getByTestId("row-menu")).getByRole("button")
    );
    await userEvent.click(
      screen.getByRole("button", { name: DiscoveriesListLabels.AddDiscovery })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: NetworkDiscoverySidePanelViews.ADD_DISCOVERY,
      })
    );
  });

  it("can trigger the delete form sidepanel", async () => {
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      state,
    });
    const row = screen.getByRole("row", { name: "my-discovery-test" });
    expect(screen.queryByTestId("delete-discovery")).not.toBeInTheDocument();
    await userEvent.click(
      within(within(row).getByTestId("row-menu")).getByRole("button")
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: DiscoveriesListLabels.DeleteDiscovery,
      })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: NetworkDiscoverySidePanelViews.DELETE_DISCOVERY,
      })
    );
  });
});
