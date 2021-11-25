import { MainTable } from "@canonical/react-components";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import deviceURLs from "app/devices/urls";
import type { Device } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";
import { isComparable } from "app/utils";
import zoneURLs from "app/zones/urls";

type Props = {
  devices: Device[];
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

const generateRows = (devices: Device[]) =>
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
                <Link
                  data-testid="device-details-link"
                  to={deviceURLs.device.index({ id: system_id })}
                >
                  <strong>{hostname}</strong>
                  <span>.{domainName}</span>
                </Link>
              }
              primaryTitle={fqdn}
              secondary={<span data-testid="mac-display">{macDisplay}</span>}
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
      "data-testid": `device-${system_id}`,
    };
  });

const DeviceListTable = ({ devices }: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort<Device, SortKey>(
    getSortValue,
    {
      key: "fqdn",
      direction: SortDirection.DESCENDING,
    }
  );
  const sortedDevices = sortRows(devices);

  return (
    <MainTable
      className="device-list-table"
      headers={[
        {
          className: "fqdn-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="fqdn-header"
                onClick={() => updateSort("fqdn")}
                sortKey="fqdn"
              >
                FQDN
              </TableHeader>
              <TableHeader>MAC address</TableHeader>
            </>
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
      rows={generateRows(sortedDevices)}
    />
  );
};

export default DeviceListTable;
