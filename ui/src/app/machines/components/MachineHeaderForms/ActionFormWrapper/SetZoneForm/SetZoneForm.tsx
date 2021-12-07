import { useEffect } from "react";

import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ActionForm from "app/base/components/ActionForm";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import type { Zone } from "app/store/zone/types";

type Props = MachineActionFormProps;

export type SetZoneFormValues = {
  zone: Zone["name"];
};

const SetZoneSchema = Yup.object().shape({
  zone: Yup.string().required("Zone is required"),
});

export const SetZoneForm = ({
  actionDisabled,
  clearHeaderContent,
  errors,
  machines,
  processingCount,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  return (
    <ActionForm<SetZoneFormValues, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={NodeActions.SET_ZONE}
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{ zone: "" }}
      loaded={zonesLoaded}
      modelName="machine"
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Set zone",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        const zone = zones.find((zone) => zone.name === values.zone);
        if (zone) {
          machines.forEach((machine) => {
            dispatch(
              machineActions.setZone({
                systemId: machine.system_id,
                zoneId: zone.id,
              })
            );
          });
        }
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={SetZoneSchema}
    >
      <Row>
        <Col size={6}>
          <ZoneSelect name="zone" required />
        </Col>
      </Row>
    </ActionForm>
  );
};

export default SetZoneForm;
