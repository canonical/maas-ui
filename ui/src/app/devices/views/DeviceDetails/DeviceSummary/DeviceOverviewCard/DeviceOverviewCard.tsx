import { Card, Spinner } from "@canonical/react-components";

import LabelledList from "app/base/components/LabelledList";
import type { Device } from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";

type Props = {
  device: Device;
};

const DeviceOverviewCard = ({ device }: Props): JSX.Element => {
  const {
    domain: { name: domainName },
    owner,
    tags,
    zone: { name: zoneName },
  } = device;

  return (
    <Card>
      <h4 className="p-muted-heading u-sv1">Overview</h4>
      <hr />
      <LabelledList
        className="u-no-margin--bottom"
        items={[
          {
            label: "Owner",
            value: owner || "—",
          },
          {
            label: "Domain",
            value: domainName || "—",
          },
          {
            label: "Zone",
            value: zoneName || "—",
          },
          {
            label: "Note",
            value: isDeviceDetails(device) ? (
              device.description || "—"
            ) : (
              <Spinner data-testid="loading-note" />
            ),
          },
          {
            label: "Tags",
            value: tags.join(", ") || "—",
          },
        ]}
      />
    </Card>
  );
};

export default DeviceOverviewCard;
