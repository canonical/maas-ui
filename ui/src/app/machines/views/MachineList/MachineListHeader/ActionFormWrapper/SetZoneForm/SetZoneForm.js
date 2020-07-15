import { Col, Row, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React from "react";

import { machine as machineActions } from "app/base/actions";
import machineSelectors from "app/store/machine/selectors";
import zoneSelectors from "app/store/zone/selectors";
import ActionForm from "app/base/components/ActionForm";
import FormikField from "app/base/components/FormikField";

const SetZoneSchema = Yup.object().shape({
  zone: Yup.string().required("Zone is required"),
});

export const SetZoneForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const errors = useSelector(machineSelectors.errors);
  const zones = useSelector(zoneSelectors.all);
  const settingZoneSelected = useSelector(machineSelectors.settingZoneSelected);

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
      actionName="set-zone"
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{ zone: "" }}
      modelName="machine"
      onSubmit={(values) => {
        const zone = zones.find((zone) => zone.name === values.zone);
        selectedMachines.forEach((machine) => {
          dispatch(machineActions.setZone(machine.system_id, zone.id));
        });
      }}
      processingCount={settingZoneSelected.length}
      selectedCount={selectedMachines.length}
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
