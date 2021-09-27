import { Col, Notification, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { PowerFormValues } from "../PowerForm";

import PowerTypeFields from "app/base/components/PowerTypeFields";
import { PowerTypeNames } from "app/store/general/constants";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import { PowerFieldScope } from "app/store/general/types";
import type { MachineDetails } from "app/store/machine/types";
import { useIsRackControllerConnected } from "app/store/machine/utils";

type Props = {
  editing: boolean;
  machine: MachineDetails;
};

const PowerFormFields = ({ editing, machine }: Props): JSX.Element => {
  const powerTypes = useSelector(powerTypesSelectors.get);
  const { values } = useFormikContext<PowerFormValues>();
  const isRackControllerConnected = useIsRackControllerConnected();

  const powerType = powerTypes.find((type) => type.name === values.powerType);
  const machineInPod = Boolean(machine.pod);
  const fieldScopes = machineInPod
    ? [PowerFieldScope.NODE]
    : [PowerFieldScope.BMC, PowerFieldScope.NODE];

  return (
    <Row>
      <Col size={6}>
        {!isRackControllerConnected && (
          <Notification data-test="no-rack-controller" severity="negative">
            Power configuration is currently disabled because no rack controller
            is currently connected to the region.
          </Notification>
        )}
        {isRackControllerConnected && !values.powerType && (
          <Notification data-test="no-power-type" severity="negative">
            This node does not have a power type set and MAAS will be unable to
            control it. Update the power information below.
          </Notification>
        )}
        {values.powerType === "manual" && (
          <Notification data-test="manual-power-type" severity="caution">
            Power control for this power type will need to be handled manually.
          </Notification>
        )}
        {editing && powerType && powerType?.missing_packages.length > 0 && (
          <Notification data-test="missing-packages" severity="negative">
            Power control software for {powerType?.description} is missing from
            the rack controller. To proceed, install the following packages on
            the rack controller: {powerType.missing_packages.join(", ") || ""}
          </Notification>
        )}
        <PowerTypeFields<PowerFormValues>
          customFieldProps={{
            [PowerTypeNames.LXD]: {
              canEditCertificate: !machineInPod,
              editing,
              machine,
            },
          }}
          disableFields={!editing}
          disableSelect={!editing || machineInPod}
          fieldScopes={fieldScopes}
          powerParametersValueName="powerParameters"
          powerTypeValueName="powerType"
        />
      </Col>
    </Row>
  );
};

export default PowerFormFields;
