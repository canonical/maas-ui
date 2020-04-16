import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import pluralize from "pluralize";
import React from "react";

import {
  machine as machineActions,
  resourcepool as resourcePoolActions,
} from "app/base/actions";
import {
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors,
} from "app/base/selectors";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";
import SetPoolFormFields from "./SetPoolFormFields";

const SetPoolSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string().required("Resource pool required"),
  poolSelection: Yup.string().oneOf(["create", "select"]).required(),
});

export const SetPoolForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();

  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const errors = useSelector(machineSelectors.errors);
  const resourcePools = useSelector(resourcePoolSelectors.all);

  return (
    <FormikForm
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{ poolSelection: "select", description: "", name: "" }}
      submitLabel={`Set resource pool of ${selectedMachines.length} ${pluralize(
        "machine",
        selectedMachines.length
      )}`}
      onCancel={() => setSelectedAction(null)}
      onSaveAnalytics={{
        action: "Set resource pool",
        category: "Take action menu",
        label: "Set resource pool of selected machines",
      }}
      onSubmit={(values) => {
        if (values.poolSelection === "create") {
          const machineIDs = selectedMachines.map(({ system_id }) => system_id);
          dispatch(resourcePoolActions.createWithMachines(values, machineIDs));
        } else {
          const pool = resourcePools.find((pool) => pool.name === values.name);
          if (pool) {
            selectedMachines.forEach((machine) => {
              dispatch(machineActions.setPool(machine.system_id, pool.id));
            });
          }
        }
        setSelectedAction(null);
      }}
      saving={saving}
      saved={saved}
      validationSchema={SetPoolSchema}
    >
      <SetPoolFormFields />
    </FormikForm>
  );
};

export default SetPoolForm;
