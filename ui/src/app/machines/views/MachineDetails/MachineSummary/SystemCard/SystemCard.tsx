import { Card, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React from "react";

import LabelledList from "app/base/components/LabelledList";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Machine["system_id"];
};

const SystemCard = ({ id }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  let content: JSX.Element;

  // Confirm that the full machine details have been fetched. This also allows
  // TypeScript know we're using the right union type (otherwise it will
  // complain that metadata doesn't exist on the base machine type).
  if (!machine || !("metadata" in machine)) {
    content = <Spinner />;
  } else {
    content = (
      <>
        <LabelledList
          items={[
            {
              label: "Vendor",
              value: machine.metadata.system_vendor || "Unknown",
            },
            {
              label: "Product",
              value: machine.metadata.system_product || "Unknown",
            },
            {
              label: "Version",
              value: machine.metadata.system_version || "Unknown",
            },
            {
              label: "Serial",
              value: machine.metadata.system_serial || "Unknown",
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
              value: machine.metadata.mainboard_vendor || "Unknown",
            },
            {
              label: "Product",
              value: (
                <div className="u-sv1">
                  {machine.metadata.mainboard_product || "Unknown"}
                </div>
              ),
            },
            {
              label: "Firmware:",
              value: "",
            },
            {
              label: "Version",
              value: machine.metadata.mainboard_firmware_version || "Unknown",
            },
            {
              label: "Date",
              value: machine.metadata.mainboard_firmware_date || "Unknown",
            },
          ]}
        />
      </>
    );
  }

  return (
    <Card className="machine-summary__system-card">
      <strong className="p-muted-heading u-sv1">System</strong>
      <hr />
      {content}
    </Card>
  );
};

export default SystemCard;
