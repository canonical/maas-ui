import { useEffect } from "react";

import { MainTable, Spinner } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import RemoveInterface from "./RemoveInterface";

import type {
  Expanded,
  SetExpanded,
} from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import TableHeader from "app/base/components/TableHeader";
import TableMenu from "app/base/components/TableMenu";
import SubnetColumn from "app/base/components/node/networking/SubnetColumn";
import { useIsAllNetworkingDisabled, useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import deviceSelectors from "app/store/device/selectors";
import type { Device, DeviceMeta } from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { getSubnetDisplay } from "app/store/subnet/utils";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import {
  getInterfaceIPAddress,
  getInterfaceName,
  getInterfaceSubnet,
  getInterfaceTypeText,
  getLinkInterface,
  getLinkModeDisplay,
} from "app/store/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { isComparable } from "app/utils";

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
  expanded: Expanded | null;
  setExpanded: SetExpanded;
  systemId: Device[DeviceMeta.PK];
};

const getSortValue = (sortKey: SortKey, row: NetworkRow) => {
  const value = row.sortData[sortKey];
  return isComparable(value) ? value : null;
};

const generateRow = (
  expanded: Expanded | null,
  fabrics: Fabric[],
  isAllNetworkingDisabled: boolean,
  link: NetworkLink | null,
  device: Device,
  nic: NetworkInterface | null,
  setExpanded: SetExpanded,
  subnets: Subnet[],
  vlans: VLAN[]
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
  const isExpanded =
    !!expanded &&
    ((link && expanded.linkId === link.id) ||
      (!link && expanded.nicId === nic?.id));
  return {
    className: classNames("p-table__row", {
      "is-active": isExpanded,
    }),
    columns: [
      {
        content: nic.mac_address,
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
                onClick: () =>
                  setExpanded({
                    content: ExpandedState.EDIT,
                    linkId: link?.id,
                    nicId: nic?.id,
                  }),
              },
              {
                children: `Remove ${typeDisplay}`,
                onClick: () =>
                  setExpanded({
                    content: ExpandedState.REMOVE,
                    linkId: link?.id,
                    nicId: nic?.id,
                  }),
              },
            ]}
            position="right"
            title="Take action:"
          />
        ),
      },
    ],
    expanded: isExpanded,
    expandedContent: (
      <div className="u-flex--grow">
        {/*
          TODO: Build edit interface form.
          https://github.com/canonical-web-and-design/app-tribe/issues/572
        */}
        {expanded?.content === ExpandedState.EDIT && <div>Edit interface</div>}
        {expanded?.content === ExpandedState.REMOVE && (
          <RemoveInterface
            closeExpanded={() => setExpanded(null)}
            nicId={nic?.id}
            systemId={device.system_id}
          />
        )}
      </div>
    ),
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
  expanded: Expanded | null,
  fabrics: Fabric[],
  isAllNetworkingDisabled: boolean,
  device: Device,
  setExpanded: (expanded: Expanded | null) => void,
  subnets: Subnet[],
  vlans: VLAN[]
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
        expanded,
        fabrics,
        isAllNetworkingDisabled,
        link,
        device,
        nic,
        setExpanded,
        subnets,
        vlans
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

const DeviceNetworkTable = ({
  expanded,
  setExpanded,
  systemId,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(device);
  const { currentSort, sortRows, updateSort } = useTableSort<
    NetworkRow,
    SortKey
  >(getSortValue, {
    key: "mac_address",
    direction: SortDirection.DESCENDING,
  });

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!isDeviceDetails(device)) {
    return <Spinner text="Loading..." />;
  }

  const rows = generateRows(
    expanded,
    fabrics,
    isAllNetworkingDisabled,
    device,
    setExpanded,
    subnets,
    vlans
  );
  const sortedRows = sortRows(rows);
  return (
    <MainTable
      className="p-table-expanding--light device-network-table"
      defaultSort="name"
      defaultSortDirection="descending"
      expanding
      headers={[
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => updateSort("mac_address")}
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
              onClick={() => updateSort("subnet")}
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
              onClick={() => updateSort("ip_address")}
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
              onClick={() => updateSort("ip_mode")}
              sortKey="ip_mode"
            >
              IP mode
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
