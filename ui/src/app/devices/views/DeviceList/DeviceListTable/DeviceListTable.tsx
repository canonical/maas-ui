import { MainTable, Spinner } from "@canonical/react-components";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import RowCheckbox from "app/base/components/RowCheckbox";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import deviceURLs from "app/devices/urls";
import type { Device, DeviceMeta } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";
import { generateCheckboxHandlers, isComparable } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";
import zoneURLs from "app/zones/urls";

type Props = {
  devices: Device[];
  hasFilter?: boolean;
  loading?: boolean;
  onSelectedChange: (newSelectedIDs: Device[DeviceMeta.PK][]) => void;
  selectedIDs: Device[DeviceMeta.PK][];
};

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
      owner,
      primary_mac,
      system_id,
      tags,
      zone: { id: zoneId, name: zoneName },
    } = device;
    const macDisplay = extra_macs.length
      ? `${primary_mac} (+${extra_macs.length})`
      : primary_mac;
    const ipAssignment = getIpAssignmentDisplay(ip_assignment);
    const tagsList = tags.join(", ");

    return {
      columns: [
        {
          className: "fqdn-col",
          content: (
            <DoubleRow
              primary={
                <RowCheckbox
                  data-test="device-checkbox"
                  handleRowCheckbox={handleRowCheckbox}
                  inputLabel={
                    <Link
                      data-test="device-details-link"
                      to={deviceURLs.device.index({ id: system_id })}
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
              secondary={<span data-test="mac-display">{macDisplay}</span>}
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
              data-test="device-zone-link"
              to={zoneURLs.details({ id: zoneId })}
            >
              {zoneName}
            </Link>
          ),
        },
        {
          className: "owner-col",
          content: (
            <DoubleRow
              primary={owner}
              primaryTitle={owner}
              secondary={tagsList}
              secondaryTitle={tagsList}
            />
          ),
        },
      ],
      "data-test": `device-${system_id}`,
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

  return (
    <MainTable
      className="device-list-table"
      emptyStateMsg={
        loading ? (
          <Spinner text="Loading..." />
        ) : hasFilter ? (
          "No devices match the search criteria."
        ) : null
      }
      headers={[
        {
          className: "fqdn-col",
          content: (
            <div className="u-flex">
              <GroupCheckbox
                data-test="all-devices-checkbox"
                handleGroupCheckbox={handleGroupCheckbox}
                items={deviceIDs}
                selectedItems={selectedIDs}
              />
              <div>
                <TableHeader
                  currentSort={currentSort}
                  data-test="fqdn-header"
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
                data-test="ip-header"
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
              data-test="zone-header"
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
                data-test="owner-header"
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
