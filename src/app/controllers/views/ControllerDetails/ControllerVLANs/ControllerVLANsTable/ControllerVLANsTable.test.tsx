import ControllerVLANsTable from "./ControllerVLANsTable";
import { ControllerVLANsColumns } from "./constants";

import urls from "app/base/urls";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  vlanState as vlanStateFactory,
  vlan as vlanFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  networkInterface as networkInterfaceFactory,
  rootState as rootStateFactory,
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
} from "testing/factories";
import { screen, within, renderWithBrowserRouter } from "testing/utils";

const createNetwork = () => {
  const systemId = "abc123";
  const fabric0 = fabricFactory({
    id: 0,
  });
  const vlan0 = vlanFactory({
    id: 0,
    fabric: 0,
  });
  const subnet0 = subnetFactory({ id: 0 });
  const nic0 = networkInterfaceFactory({
    id: 0,
    name: "eth0",
    type: NetworkInterfaceTypes.PHYSICAL,
    parents: [],
    children: [],
    links: [],
    vlan_id: 0,
  });
  const interfaces = [nic0];
  const controller = controllerDetailsFactory({
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
  const state = rootStateFactory({
    fabric: fabricStateFactory({ loaded: true, items: [net.fabric0] }),
    vlan: vlanStateFactory({ loaded: false, items: [] }),
    subnet: subnetStateFactory({ loaded: true, items: [net.subnet0] }),
    controller: controllerStateFactory({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithBrowserRouter(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      route: urls.controllers.controller.vlans({
        id: net.controller.system_id,
      }),
    }
  );

  const vlanTable = screen.getByRole("table", { name: "Controller VLANs" });
  expect(within(vlanTable).getByText("Loading...")).toBeInTheDocument();
});

it("displays correct text for no VLANs", function () {
  const net = createNetwork();
  const state = rootStateFactory({
    fabric: fabricStateFactory({ loaded: true, items: [net.fabric0] }),
    vlan: vlanStateFactory({ loaded: true, items: [] }),
    subnet: subnetStateFactory({ loaded: true, items: [net.subnet0] }),
    controller: controllerStateFactory({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithBrowserRouter(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      route: urls.controllers.controller.vlans({
        id: net.controller.system_id,
      }),
    }
  );

  const vlanTable = screen.getByRole("table", { name: "Controller VLANs" });
  expect(within(vlanTable).getByText("No VLANs found")).toBeInTheDocument();
});

it("displays a VLANs table with a single row", function () {
  const net = createNetwork();
  const state = rootStateFactory({
    fabric: fabricStateFactory({ loaded: true, items: [net.fabric0] }),
    vlan: vlanStateFactory({ loaded: true, items: [net.vlan0] }),
    subnet: subnetStateFactory({ loaded: true, items: [net.subnet0] }),
    controller: controllerStateFactory({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithBrowserRouter(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      route: urls.controllers.controller.vlans({
        id: net.controller.system_id,
      }),
    }
  );

  const vlanTable = screen.getByRole("table", { name: "Controller VLANs" });
  expect(vlanTable).toBeInTheDocument();
  const tableBody = within(vlanTable).getAllByRole("rowgroup")[1];
  const vlanTableRows = within(tableBody).getAllByRole("row");
  expect(vlanTableRows.length).toEqual(1);
});

it("displays no duplicate vlans", function () {
  const net = createNetwork();
  const nic1 = networkInterfaceFactory({
    id: 1,
    name: "eth1",
    type: NetworkInterfaceTypes.PHYSICAL,
    parents: [],
    children: [],
    links: [],
    vlan_id: 0,
  });
  net.controller = controllerDetailsFactory({
    system_id: net.controller.system_id,
    interfaces: [net.nic0, nic1],
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({ loaded: true, items: [net.fabric0] }),
    vlan: vlanStateFactory({ loaded: true, items: [net.vlan0] }),
    subnet: subnetStateFactory({ loaded: true, items: [net.subnet0] }),
    controller: controllerStateFactory({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithBrowserRouter(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      route: urls.controllers.controller.vlans({
        id: net.controller.system_id,
      }),
    }
  );

  const tableBody = screen.getAllByRole("rowgroup")[1];
  const vlanTableRows = within(tableBody).getAllByRole("row");
  expect(vlanTableRows.length).toEqual(1);
});

it("displays correct text within each cell", () => {
  const net = createNetwork();
  const state = rootStateFactory({
    fabric: fabricStateFactory({ loaded: true, items: [net.fabric0] }),
    vlan: vlanStateFactory({ loaded: true, items: [net.vlan0] }),
    subnet: subnetStateFactory({ loaded: true, items: [net.subnet0] }),
    controller: controllerStateFactory({
      items: [net.controller],
      loaded: true,
      loading: false,
    }),
  });

  renderWithBrowserRouter(
    <ControllerVLANsTable systemId={net.controller.system_id} />,
    {
      state,
      route: urls.controllers.controller.vlans({
        id: net.controller.system_id,
      }),
    }
  );

  const expectedColumnContent = {
    [ControllerVLANsColumns.FABRIC]: net.fabric0.name,
    [ControllerVLANsColumns.VLAN]: net.vlan0.name,
    [ControllerVLANsColumns.DHCP]: "No DHCP",
  };

  const row = screen.getByRole("row", {
    name: new RegExp(net.fabric0.name),
  });

  Object.values(expectedColumnContent).forEach((value, index) => {
    expect(within(row).getAllByRole("cell")[index]).toHaveTextContent(
      new RegExp(value)
    );
  });
});
