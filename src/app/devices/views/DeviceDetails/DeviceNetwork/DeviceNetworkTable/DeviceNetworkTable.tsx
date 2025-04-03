import { MainTable, Spinner } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useSelector } from "react-redux";

import MacAddressDisplay from "@/app/base/components/MacAddressDisplay";
import TableHeader from "@/app/base/components/TableHeader";
import TableMenu from "@/app/base/components/TableMenu";
import SubnetColumn from "@/app/base/components/node/networking/SubnetColumn";
import {
  useFetchActions,
  useIsAllNetworkingDisabled,
  useTableSort,
} from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { useSidePanel } from "@/app/base/side-panel-context";
import { SortDirection } from "@/app/base/types";
import { DeviceSidePanelViews } from "@/app/devices/constants";
import deviceSelectors from "@/app/store/device/selectors";
import type { Device, DeviceMeta } from "@/app/store/device/types";
import { isDeviceDetails } from "@/app/store/device/utils";
import { fabricActions } from "@/app/store/fabric";
import fabricSelectors from "@/app/store/fabric/selectors";
import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet } from "@/app/store/subnet/types";
import { getSubnetDisplay } from "@/app/store/subnet/utils";
import type { NetworkInterface, NetworkLink } from "@/app/store/types/node";
import {
  getInterfaceIPAddress,
  getInterfaceName,
  getInterfaceSubnet,
  getInterfaceTypeText,
  getLinkInterface,
  getLinkModeDisplay,
} from "@/app/store/utils";
import { vlanActions } from "@/app/store/vlan";
import vlanSelectors from "@/app/store/vlan/selectors";
import type { VLAN } from "@/app/store/vlan/types";
import { isComparable } from "@/app/utils";

type NetworkRowSortData = {
  ip_address: string | null;
  ip_mode: string | null;
  mac_address: NetworkInterface["mac_address"];
  subnet: string | null;
};

type NetworkRow = Omit<MainTableRow, "sortData"> & {
  sortData: NetworkRowSortData;
};

type SortKey = keyof NetworkRowSortData;

type Props = {
  systemId: Device[DeviceMeta.PK];
};

const getSortValue = (sortKey: SortKey, row: NetworkRow) => {
  const value = row.sortData[sortKey];
  return isComparable(value) ? value : null;
};

const generateRow = (
  fabrics: Fabric[],
  isAllNetworkingDisabled: boolean,
  link: NetworkLink | null,
  device: Device,
  nic: NetworkInterface | null,
  subnets: Subnet[],
  vlans: VLAN[],
  setSidePanelContent: SetSidePanelContent
): NetworkRow | null => {
  if (link && !nic) {
    [nic] = getLinkInterface(device, link);
  }
  if (!nic) {
    return null;
  }
  const name = getInterfaceName(device, nic, link);
  const subnet = getInterfaceSubnet(
    device,
    subnets,
    fabrics,
    vlans,
    isAllNetworkingDisabled,
    nic,
    link
  );
  const typeDisplay = getInterfaceTypeText(device, nic, link);

  return {
    className: "p-table__row",
    columns: [
      {
        content: <MacAddressDisplay>{nic.mac_address}</MacAddressDisplay>,
      },
      {
        content: <SubnetColumn link={link} nic={nic} node={device} />,
      },
      {
        content: (
          <span data-testid="ip-address">
            {getInterfaceIPAddress(device, fabrics, vlans, nic, link)}
          </span>
        ),
      },
      {
        content: <span data-testid="ip-mode">{getLinkModeDisplay(link)}</span>,
      },
      {
        className: "u-align--right",
        content: (
          <TableMenu
            disabled={isAllNetworkingDisabled}
            links={[
              {
                children: `Edit ${typeDisplay}`,
                onClick: () => {
                  setSidePanelContent({
                    view: DeviceSidePanelViews.EDIT_INTERFACE,
                    extras: { linkId: link?.id, nicId: nic?.id },
                  });
                },
              },
              {
                children: `Remove ${typeDisplay}`,
                onClick: () => {
                  setSidePanelContent({
                    view: DeviceSidePanelViews.REMOVE_INTERFACE,
                    extras: { linkId: link?.id, nicId: nic?.id },
                  });
                },
              },
            ]}
            position="right"
            title="Take action:"
          />
        ),
      },
    ],
    key: name,
    sortData: {
      ip_address:
        getInterfaceIPAddress(device, fabrics, vlans, nic, link) || null,
      ip_mode: getLinkModeDisplay(link) || null,
      mac_address: nic.mac_address,
      subnet: getSubnetDisplay(subnet),
    },
  };
};

const generateRows = (
  fabrics: Fabric[],
  isAllNetworkingDisabled: boolean,
  device: Device,
  subnets: Subnet[],
  vlans: VLAN[],
  setSidePanelContent: SetSidePanelContent
): NetworkRow[] => {
  if (!isDeviceDetails(device)) {
    return [];
  }
  const rows: NetworkRow[] = [];
  // Create a list of interfaces and aliases to use to generate the table rows.
  device.interfaces.forEach((nic: NetworkInterface) => {
    const createRow = (
      link: NetworkLink | null,
      nic: NetworkInterface | null
    ) =>
      generateRow(
        fabrics,
        isAllNetworkingDisabled,
        link,
        device,
        nic,
        subnets,
        vlans,
        setSidePanelContent
      );
    if (nic.links.length === 0) {
      const row = createRow(null, nic);
      if (row) {
        rows.push(row);
      }
    } else {
      nic.links.forEach((link: NetworkLink) => {
        const row = createRow(link, null);
        if (row) {
          rows.push(row);
        }
      });
    }
  });
  return rows;
};

const DeviceNetworkTable = ({ systemId }: Props): JSX.Element => {
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const { setSidePanelContent } = useSidePanel();
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(device);
  const { currentSort, sortRows, updateSort } = useTableSort<
    NetworkRow,
    SortKey
  >(getSortValue, {
    key: "mac_address",
    direction: SortDirection.DESCENDING,
  });

  useFetchActions([
    fabricActions.fetch,
    subnetActions.fetch,
    vlanActions.fetch,
  ]);

  if (!isDeviceDetails(device)) {
    return <Spinner text="Loading..." />;
  }

  const rows = generateRows(
    fabrics,
    isAllNetworkingDisabled,
    device,
    subnets,
    vlans,
    setSidePanelContent
  );
  const sortedRows = sortRows(rows);
  return (
    <MainTable
      aria-label="Interfaces"
      className="p-table-expanding--light device-network-table"
      defaultSort="name"
      defaultSortDirection="descending"
      emptyStateMsg="No interfaces available."
      expanding
      headers={[
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                updateSort("mac_address");
              }}
              sortKey="mac_address"
            >
              Mac
            </TableHeader>
          ),
        },
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                updateSort("subnet");
              }}
              sortKey="subnet"
            >
              Subnet
            </TableHeader>
          ),
        },
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                updateSort("ip_address");
              }}
              sortKey="ip_address"
            >
              IP Address
            </TableHeader>
          ),
        },
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                updateSort("ip_mode");
              }}
              sortKey="ip_mode"
            >
              IP assignment
            </TableHeader>
          ),
        },
        {
          content: "Actions",
          className: "u-align--right",
        },
      ]}
      rows={sortedRows}
    />
  );
};

export default DeviceNetworkTable;
