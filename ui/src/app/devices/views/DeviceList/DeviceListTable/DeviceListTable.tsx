import { MainTable } from "@canonical/react-components";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import deviceURLs from "app/devices/urls";
import type { Device } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";
import zoneURLs from "app/zones/urls";

type Props = {
  devices: Device[];
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
                  data-test="device-details-link"
                  to={deviceURLs.device.index({ id: system_id })}
                >
                  <strong>{hostname}</strong>
                  <span>.{domainName}</span>
                </Link>
              }
              primaryTitle={fqdn}
              secondary={<span data-test="mac-display">{macDisplay}</span>}
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
    };
  });

const DeviceListTable = ({ devices }: Props): JSX.Element => {
  return (
    <MainTable
      className="device-list-table"
      headers={[
        {
          className: "fqdn-col",
          content: (
            <>
              <TableHeader>FQDN</TableHeader>
              <TableHeader>MAC address</TableHeader>
            </>
          ),
        },
        {
          className: "ip-col",
          content: (
            <>
              <TableHeader>IP assignment</TableHeader>
              <TableHeader>IP address</TableHeader>
            </>
          ),
        },
        {
          className: "zone-col",
          content: <TableHeader>Zone</TableHeader>,
        },
        {
          className: "owner-col",
          content: (
            <>
              <TableHeader>Owner</TableHeader>
              <TableHeader>Tags</TableHeader>
            </>
          ),
        },
      ]}
      rows={generateRows(devices)}
    />
  );
};

export default DeviceListTable;
