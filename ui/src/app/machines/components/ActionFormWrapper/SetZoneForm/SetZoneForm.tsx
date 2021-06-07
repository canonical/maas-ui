import { useEffect } from "react";

import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ActionForm from "app/base/components/ActionForm";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { ClearSelectedAction } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { NodeActions } from "app/store/types/node";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import type { Zone } from "app/store/zone/types";

type Props = {
  actionDisabled?: boolean;
  clearSelectedAction: ClearSelectedAction;
};

export type SetZoneFormValues = {
  zone: Zone["name"];
};

const SetZoneSchema = Yup.object().shape({
  zone: Yup.string().required("Zone is required"),
});

export const SetZoneForm = ({
  actionDisabled,
  clearSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    NodeActions.SET_ZONE
  );

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  return (
    <ActionForm
      actionDisabled={actionDisabled}
      actionName={NodeActions.SET_ZONE}
      cleanup={machineActions.cleanup}
      clearSelectedAction={clearSelectedAction}
      errors={errors}
      initialValues={{ zone: "" }}
      loaded={zonesLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Set zone",
      }}
      onSubmit={(values: SetZoneFormValues) => {
        const zone = zones.find((zone) => zone.name === values.zone);
        if (zone) {
          machinesToAction.forEach((machine) => {
            dispatch(
              machineActions.setZone({
                systemId: machine.system_id,
                zoneId: zone.id,
              })
            );
          });
        }
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={SetZoneSchema}
    >
      <Row>
        <Col size="6">
          <ZoneSelect name="zone" required />
        </Col>
      </Row>
    </ActionForm>
  );
};

export default SetZoneForm;
