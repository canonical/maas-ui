import { Col, Row, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import pluralize from "pluralize";
import React from "react";

import { machine as machineActions } from "app/base/actions";
import {
  machine as machineSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import FormikForm from "app/base/components/FormikForm";
import FormikField from "app/base/components/FormikField";
import FormCardButtons from "app/base/components/FormCardButtons";

const SetZoneSchema = Yup.object().shape({
  zone: Yup.string().required("Zone is required"),
});

export const SetZoneForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();

  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const errors = useSelector(machineSelectors.errors);
  const zones = useSelector(zoneSelectors.all);

  const zoneOptions = [
    { label: "Select your zone", value: "", disabled: true },
    ...zones.map((zone) => ({
      key: `zone-${zone.id}`,
      label: zone.name,
      value: zone.name,
    })),
  ];

  return (
    <FormikForm
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{ zone: "" }}
      submitLabel={`Set zone of ${selectedMachines.length} ${pluralize(
        "machine",
        selectedMachines.length
      )}`}
      onCancel={() => setSelectedAction(null)}
      onSaveAnalytics={{
        action: "Set zone",
        category: "Take action menu",
        label: "Set zone of selected machines",
      }}
      onSubmit={(values) => {
        const zone = zones.find((zone) => zone.name === values.zone);
        selectedMachines.forEach((machine) => {
          dispatch(machineActions.setZone(machine.system_id, zone.id));
        });
        setSelectedAction(null);
      }}
      saving={saving}
      saved={saved}
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
    </FormikForm>
  );
};

export default SetZoneForm;
