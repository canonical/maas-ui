import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import DiscoveriesList, {
  Labels as DiscoveriesListLabels,
} from "./DiscoveriesList";

import type { RootState } from "app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
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
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();
const route = "/dashboard";

describe("DiscoveriesList", () => {
  let state: RootState;

  beforeEach(() => {
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
        testing_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
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
        loaded: true,
        items: machines,
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

  it("displays the discoveries", () => {
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      wrapperProps: { state },
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
      wrapperProps: { state },
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
      wrapperProps: { state },
    });
    expect(
      screen.getByText(DiscoveriesListLabels.NoNewDiscoveries)
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(DiscoveriesListLabels.Title)
    ).not.toBeInTheDocument();
  });

  it("can display the add form", async () => {
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      wrapperProps: { state },
    });
    const row = screen.getByRole("row", { name: "my-discovery-test" });
    expect(
      screen.queryByRole("form", { name: "Add discovery" })
    ).not.toBeInTheDocument();
    await userEvent.click(
      within(within(row).getByTestId("row-menu")).getByRole("button")
    );
    await userEvent.click(
      screen.getByRole("button", { name: DiscoveriesListLabels.AddDiscovery })
    );

    expect(
      screen.getByRole("form", { name: "Add discovery" })
    ).toBeInTheDocument();
  });

  it("can display the delete form", async () => {
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      wrapperProps: { state },
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

    expect(
      screen.getByText(
        'Are you sure you want to delete discovery "my-discovery-test"?'
      )
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("can delete a discovery", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<DiscoveriesList />, {
      route: route,
      wrapperProps: { store },
    });
    const row = screen.getByRole("row", { name: "my-discovery-test" });

    // Open the action menu.
    await userEvent.click(
      within(within(row).getByTestId("row-menu")).getByRole("button")
    );

    // Click on the delete link.
    await userEvent.click(
      screen.getByRole("button", {
        name: DiscoveriesListLabels.DeleteDiscovery,
      })
    );

    // Click on the confirm button.
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      store.getActions().some((action) => action.type === "discovery/delete")
    ).toBe(true);
  });
});
