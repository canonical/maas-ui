import ControllerVLANsTable from "./ControllerVLANsTable";

import urls from "@/app/base/urls";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, within } from "@/testing/utils";

const createNetwork = () => {
  const systemId = "abc123";
  const fabric0 = factory.fabric({
    id: 0,
  });
  const vlan0 = factory.vlan({
    id: 0,
    fabric: 0,
  });
  const subnet0 = factory.subnet({ id: 0 });
  const nic0 = factory.networkInterface({
    id: 0,
    name: "eth0",
    type: NetworkInterfaceTypes.PHYSICAL,
    parents: [],
    children: [],
    links: [],
    vlan_id: 0,
  });
  const interfaces = [nic0];
  const controller = factory.controllerDetails({
    system_id: systemId,
    interfaces,
  });
  return {
    fabric0,
    vlan0,
    subnet0,
    nic0,
    interfaces,
    controller,
  };
};

it("displays correct text when loading", function () {
  const net = createNetwork();
  const state = factory.rootState({
    fabric: factory.fabricState({ loaded: true, items: [net.fabric0] }),
    vlan: factory.vlanState({ loaded: false, items: [] }),
    subnet: factory.subnetState({ loaded: true, items: [net.subnet0] }),
    controller: factory.controllerState({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithProviders(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      initialEntries: [
        urls.controllers.controller.vlans({
          id: net.controller.system_id,
        }),
      ],
    }
  );

  const vlanTable = screen.getByRole("grid", { name: "Controller VLANs" });
  expect(within(vlanTable).getByText("Loading...")).toBeInTheDocument();
});

it("displays correct text for no VLANs", function () {
  const net = createNetwork();
  const state = factory.rootState({
    fabric: factory.fabricState({ loaded: true, items: [net.fabric0] }),
    vlan: factory.vlanState({ loaded: true, items: [] }),
    subnet: factory.subnetState({ loaded: true, items: [net.subnet0] }),
    controller: factory.controllerState({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithProviders(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      initialEntries: [
        urls.controllers.controller.vlans({
          id: net.controller.system_id,
        }),
      ],
    }
  );

  const vlanTable = screen.getByRole("grid", { name: "Controller VLANs" });
  expect(within(vlanTable).getByText(/No VLANs found/)).toBeInTheDocument();
});

it("displays a VLANs table with a single row", function () {
  const net = createNetwork();
  const state = factory.rootState({
    fabric: factory.fabricState({ loaded: true, items: [net.fabric0] }),
    vlan: factory.vlanState({ loaded: true, items: [net.vlan0] }),
    subnet: factory.subnetState({ loaded: true, items: [net.subnet0] }),
    controller: factory.controllerState({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithProviders(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      initialEntries: [
        urls.controllers.controller.vlans({
          id: net.controller.system_id,
        }),
      ],
    }
  );

  const vlanTable = screen.getByRole("grid", { name: "Controller VLANs" });
  expect(vlanTable).toBeInTheDocument();
  const tableBody = within(vlanTable).getAllByRole("rowgroup")[1];
  const vlanTableRows = within(tableBody).getAllByRole("row");
  // GenericTable with groupBy renders one fabric group row + one leaf VLAN row per unique VLAN
  expect(vlanTableRows.length).toEqual(2);
});

it("displays no duplicate vlans", function () {
  const net = createNetwork();
  const nic1 = factory.networkInterface({
    id: 1,
    name: "eth1",
    type: NetworkInterfaceTypes.PHYSICAL,
    parents: [],
    children: [],
    links: [],
    vlan_id: 0,
  });
  net.controller = factory.controllerDetails({
    system_id: net.controller.system_id,
    interfaces: [net.nic0, nic1],
  });
  const state = factory.rootState({
    fabric: factory.fabricState({ loaded: true, items: [net.fabric0] }),
    vlan: factory.vlanState({ loaded: true, items: [net.vlan0] }),
    subnet: factory.subnetState({ loaded: true, items: [net.subnet0] }),
    controller: factory.controllerState({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithProviders(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      initialEntries: [
        urls.controllers.controller.vlans({
          id: net.controller.system_id,
        }),
      ],
    }
  );

  const tableBody = screen.getAllByRole("rowgroup")[1];
  const vlanTableRows = within(tableBody).getAllByRole("row");
  // GenericTable with groupBy renders one fabric group row + one leaf VLAN row per unique VLAN
  expect(vlanTableRows.length).toEqual(2);
});

it("displays correct text within each cell", () => {
  const net = createNetwork();
  const state = factory.rootState({
    fabric: factory.fabricState({ loaded: true, items: [net.fabric0] }),
    vlan: factory.vlanState({ loaded: true, items: [net.vlan0] }),
    subnet: factory.subnetState({ loaded: true, items: [net.subnet0] }),
    controller: factory.controllerState({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithProviders(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      initialEntries: [
        urls.controllers.controller.vlans({
          id: net.controller.system_id,
        }),
      ],
    }
  );

  const vlanTable = screen.getByRole("grid", { name: "Controller VLANs" });
  const tableBody = within(vlanTable).getAllByRole("rowgroup")[1];
  const [fabricGroupRow, vlanLeafRow] = within(tableBody).getAllByRole("row");

  // The fabric group row shows only the fabric name (filterCells hides other columns)
  expect(fabricGroupRow).toHaveTextContent(net.fabric0.name);

  // The leaf VLAN row shows VLAN, DHCP, etc. (filterCells hides the fabric column)
  expect(vlanLeafRow).toHaveTextContent(net.vlan0.name);
  expect(vlanLeafRow).toHaveTextContent("No DHCP");
});
