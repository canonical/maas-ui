import { MainTable } from "@canonical/react-components";
import { Link } from "react-router-dom";

import OwnerColumn from "./OwnerColumn";

import DoubleRow from "@/app/base/components/DoubleRow";
import GroupCheckbox from "@/app/base/components/GroupCheckbox";
import MacAddressDisplay from "@/app/base/components/MacAddressDisplay";
import RowCheckbox from "@/app/base/components/RowCheckbox";
import TableHeader from "@/app/base/components/TableHeader";
import { useTableSort } from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import urls from "@/app/base/urls";
import type { Device, DeviceMeta } from "@/app/store/device/types";
import { getIpAssignmentDisplay } from "@/app/store/device/utils";
import {
  generateCheckboxHandlers,
  generateEmptyStateMsg,
  getTableStatus,
  isComparable,
} from "@/app/utils";
import type { CheckboxHandlers } from "@/app/utils/generateCheckboxHandlers";

type Props = {
  devices: Device[];
  hasFilter?: boolean;
  loading?: boolean;
  onSelectedChange: (newSelectedIDs: Device[DeviceMeta.PK][]) => void;
  selectedIDs: Device[DeviceMeta.PK][];
};

export enum Labels {
  EmptyList = "No devices available.",
  NoResults = "No devices match the search criteria.",
}

type SortKey = keyof Device;

const getSortValue = (sortKey: SortKey, device: Device) => {
  switch (sortKey) {
    case "ip_assignment":
      return getIpAssignmentDisplay(device.ip_assignment);
    case "zone":
      return device.zone?.name;
  }
  const value = device[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = (
  devices: Device[],
  selectedIDs: Device[DeviceMeta.PK][],
  handleRowCheckbox: CheckboxHandlers<
    Device[DeviceMeta.PK]
  >["handleRowCheckbox"]
) =>
  devices.map((device) => {
    const {
      domain: { name: domainName },
      extra_macs,
      fqdn,
      hostname,
      ip_address,
      ip_assignment,
      primary_mac,
      system_id,
      zone: { id: zoneId, name: zoneName },
    } = device;
    const macDisplay = extra_macs.length
      ? `${primary_mac} (+${extra_macs.length})`
      : primary_mac;
    const ipAssignment = getIpAssignmentDisplay(ip_assignment);

    return {
      columns: [
        {
          className: "fqdn-col",
          content: (
            <DoubleRow
              primary={
                <RowCheckbox
                  data-testid="device-checkbox"
                  handleRowCheckbox={handleRowCheckbox}
                  inputLabel={
                    <Link
                      data-testid="device-details-link"
                      to={urls.devices.device.index({ id: system_id })}
                    >
                      <strong>{hostname}</strong>
                      <span>.{domainName}</span>
                    </Link>
                  }
                  item={device.system_id}
                  items={selectedIDs}
                />
              }
              primaryTitle={fqdn}
              secondary={
                <MacAddressDisplay data-testid="mac-display">
                  {macDisplay}
                </MacAddressDisplay>
              }
              secondaryClassName="u-nudge--secondary-row"
              secondaryTitle={[primary_mac, ...extra_macs].join(", ")}
            />
          ),
        },
        {
          className: "ip-col",
          content: (
            <DoubleRow
              primary={ipAssignment}
              primaryTitle={ipAssignment}
              secondary={ip_address}
              secondaryTitle={ip_address}
            />
          ),
        },
        {
          className: "zone-col",
          content: (
            <Link
              className="p-link--soft"
              data-testid="device-zone-link"
              to={urls.zones.details({ id: zoneId })}
            >
              {zoneName}
            </Link>
          ),
        },
        {
          className: "owner-col",
          content: <OwnerColumn systemId={device.system_id} />,
        },
      ],
      "data-testid": `device-${system_id}`,
    };
  });

const DeviceListTable = ({
  devices,
  hasFilter = false,
  loading = false,
  onSelectedChange,
  selectedIDs,
}: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort<Device, SortKey>(
    getSortValue,
    {
      key: "fqdn",
      direction: SortDirection.DESCENDING,
    }
  );
  const sortedDevices = sortRows(devices);
  const { handleGroupCheckbox, handleRowCheckbox } =
    generateCheckboxHandlers<Device[DeviceMeta.PK]>(onSelectedChange);
  const deviceIDs = devices.map((device) => device.system_id);
  const tableStatus = getTableStatus({ isLoading: loading, hasFilter });

  return (
    <MainTable
      className="device-list-table"
      emptyStateMsg={generateEmptyStateMsg(tableStatus, {
        default: Labels.EmptyList,
        filtered: Labels.NoResults,
      })}
      headers={[
        {
          className: "fqdn-col",
          content: (
            <div className="u-flex">
              <GroupCheckbox
                aria-label="all devices"
                data-testid="all-devices-checkbox"
                handleGroupCheckbox={handleGroupCheckbox}
                items={deviceIDs}
                selectedItems={selectedIDs}
              />
              <div>
                <TableHeader
                  currentSort={currentSort}
                  data-testid="fqdn-header"
                  onClick={() => updateSort("fqdn")}
                  sortKey="fqdn"
                >
                  FQDN
                </TableHeader>
                <TableHeader>MAC address</TableHeader>
              </div>
            </div>
          ),
        },
        {
          className: "ip-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="ip-header"
                onClick={() => updateSort("ip_assignment")}
                sortKey="ip_assignment"
              >
                IP assignment
              </TableHeader>
              <TableHeader>IP address</TableHeader>
            </>
          ),
        },
        {
          className: "zone-col",
          content: (
            <TableHeader
              currentSort={currentSort}
              data-testid="zone-header"
              onClick={() => updateSort("zone")}
              sortKey="zone"
            >
              Zone
            </TableHeader>
          ),
        },
        {
          className: "owner-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="owner-header"
                onClick={() => updateSort("owner")}
                sortKey="owner"
              >
                Owner
              </TableHeader>
              <TableHeader>Tags</TableHeader>
            </>
          ),
        },
      ]}
      rows={generateRows(sortedDevices, selectedIDs, handleRowCheckbox)}
    />
  );
};

export default DeviceListTable;
