import { Card } from "@canonical/react-components";

import LabelledList from "app/base/components/LabelledList";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";

type Props = {
  node: ControllerDetails | MachineDetails;
};

const HardwareCard = ({ node }: Props): JSX.Element => {
  return (
    <Card>
      <strong className="p-muted-heading u-sv1">Hardware information</strong>
      <hr />
      <span className="u-sv1">System</span>
      <LabelledList
        items={[
          {
            label: "Vendor",
            value: node.metadata.system_vendor || "Unknown",
          },
          {
            label: "Product",
            value: node.metadata.system_product || "Unknown",
          },
          {
            label: "Version",
            value: node.metadata.system_version || "Unknown",
          },
          {
            label: "Serial",
            value: node.metadata.system_serial || "Unknown",
          },
        ]}
      />
      <hr />
      <span className="u-sv1">Mainboard</span>
      <LabelledList
        className="u-no-margin--bottom"
        items={[
          {
            label: "Vendor",
            value: node.metadata.mainboard_vendor || "Unknown",
          },
          {
            label: "Product",
            value: (
              <div className="u-sv1">
                {node.metadata.mainboard_product || "Unknown"}
              </div>
            ),
          },
          {
            label: "Firmware",
            value: node.metadata.mainboard_firmware_vendor || "Unknown",
          },
          {
            label: "Version",
            value: node.metadata.mainboard_firmware_version || "Unknown",
          },
          {
            label: "Date",
            value: node.metadata.mainboard_firmware_date || "Unknown",
          },
        ]}
      />
    </Card>
  );
};

export default HardwareCard;
