import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import PowerParameterDefinition from "./PowerParameterDefinition";

import CertificateDetails from "app/base/components/CertificateDetails";
import Definition from "app/base/components/Definition";
import { useIsRackControllerConnected } from "app/base/hooks";
import { PowerTypeNames } from "app/store/general/constants";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { PowerField } from "app/store/general/types";
import {
  getFieldsInScope,
  getPowerTypeFromName,
} from "app/store/general/utils";
import type { MachineDetails } from "app/store/machine/types";
import { getMachineFieldScopes } from "app/store/machine/utils";

type Props = {
  machine: MachineDetails;
};

const generateParameters = (machine: MachineDetails, fields: PowerField[]) => {
  const { certificate, power_parameters } = machine;
  const baseParameters = fields.reduce<React.ReactNode[]>(
    (parameters, field) => {
      const isCertificateField = ["certificate", "key"].includes(field.name);
      if (!isCertificateField && field.name in power_parameters) {
        const powerParameter = power_parameters[field.name];
        parameters.push(
          <PowerParameterDefinition
            field={field}
            key={field.name}
            powerParameter={powerParameter}
          />
        );
      }
      return parameters;
    },
    []
  );
  const certificateParameters = certificate ? (
    <CertificateDetails
      certificate={power_parameters.certificate as string}
      eventCategory="Machine configuration"
      metadata={certificate}
    />
  ) : null;
  return (
    <>
      {baseParameters}
      {certificateParameters}
    </>
  );
};

const PowerParameters = ({ machine }: Props): JSX.Element => {
  const powerTypes = useSelector(powerTypesSelectors.get);
  const isRackControllerConnected = useIsRackControllerConnected();
  const powerType = getPowerTypeFromName(powerTypes, machine.power_type);
  const fieldScopes = getMachineFieldScopes(machine);
  const fieldsInScope = getFieldsInScope(powerType, fieldScopes);

  return (
    <>
      {!isRackControllerConnected && (
        <Notification data-testid="no-rack-controller" severity="negative">
          Power configuration is currently disabled because no rack controller
          is currently connected to the region.
        </Notification>
      )}
      {isRackControllerConnected && !powerType && (
        <Notification data-testid="no-power-type" severity="negative">
          This node does not have a power type set and MAAS will be unable to
          control it. Update the power information below.
        </Notification>
      )}
      {powerType?.name === PowerTypeNames.MANUAL && (
        <Notification data-testid="manual-power-type" severity="caution">
          Power control for this power type will need to be handled manually.
        </Notification>
      )}
      {powerType && powerType.missing_packages.length > 0 && (
        <Notification data-testid="missing-packages" severity="negative">
          Power control software for {powerType.description} is missing from the
          rack controller. To proceed, install the following packages on the
          rack controller: {powerType.missing_packages.join(", ")}
        </Notification>
      )}
      <Definition label="Power type">
        {powerType?.description || "None"}
      </Definition>
      {generateParameters(machine, fieldsInScope)}
    </>
  );
};

export default PowerParameters;
