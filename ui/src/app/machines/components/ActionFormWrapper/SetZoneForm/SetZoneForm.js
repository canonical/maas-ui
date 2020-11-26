import { Col, Row, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { actions as machineActions } from "app/store/machine";
import { useMachineActionForm } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import { NodeActions } from "app/store/types/node";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import ActionForm from "app/base/components/ActionForm";
import FormikField from "app/base/components/FormikField";

const SetZoneSchema = Yup.object().shape({
  zone: Yup.string().required("Zone is required"),
});

export const SetZoneForm = ({ setSelectedAction }) => {
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

  const zoneOptions = [
    { label: "Select your zone", value: "", disabled: true },
    ...zones.map((zone) => ({
      key: `zone-${zone.id}`,
      label: zone.name,
      value: zone.name,
    })),
  ];

  return (
    <ActionForm
      actionName={NodeActions.SET_ZONE}
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{ zone: "" }}
      loaded={zonesLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Set zone",
      }}
      onSubmit={(values) => {
        const zone = zones.find((zone) => zone.name === values.zone);
        machinesToAction.forEach((machine) => {
          dispatch(machineActions.setZone(machine.system_id, zone.id));
        });
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={SetZoneSchema}
    >
      <Row>
        <Col size="6">
          <FormikField
            component={Select}
            label="Zone"
            name="zone"
            options={zoneOptions}
            required
          />
        </Col>
      </Row>
    </ActionForm>
  );
};

SetZoneForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default SetZoneForm;
