import { Spinner } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import AddRSDFormFields from "../AddRSDFormFields";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

const AddRSDSchema = Yup.object().shape({
  name: Yup.string(),
  pool: Yup.number().integer().required("Resource pool required"),
  power_address: Yup.string().required("Address required"),
  power_pass: Yup.string().required("Password required"),
  power_user: Yup.string().required("User required"),
  zone: Yup.number().integer().required("Zone required"),
});

export const AddRSDForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const podErrors = useSelector(podSelectors.errors);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const [resetOnSave, setResetOnSave] = useState(false);
  const [savingPod, setSavingPod] = useState(false);

  // Fetch all data required for the form.
  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (podSaved && resetOnSave) {
      setResetOnSave(false);
    }
  }, [podSaved, resetOnSave]);

  useWindowTitle("Add pod");

  useAddMessage(
    podSaved,
    podActions.cleanup,
    `${savingPod} added successfully.`,
    setSavingPod
  );

  let errors = "";
  if (podErrors && typeof podErrors === "string") {
    errors = podErrors;
  } else if (podErrors && typeof podErrors === "object") {
    Object.keys(podErrors).forEach((key) => {
      errors = errors + `${podErrors[key]} `;
    });
  }

  return (
    <>
      {!(resourcePoolsLoaded && zonesLoaded) ? (
        <Spinner text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add RSD">
          <FormikForm
            buttons={FormCardButtons}
            cleanup={podActions.cleanup}
            errors={errors}
            initialValues={{
              name: "",
              pool: (resourcePools.length && resourcePools[0].id) || 0,
              power_address: "",
              power_pass: "",
              power_user: "",
              zone: (zones.length && zones[0].id) || 0,
            }}
            onCancel={() => history.push({ pathname: "/machines" })}
            onSaveAnalytics={{
              action: resetOnSave ? "Save and add another" : "Save",
              category: "Pod",
              label: "Add RSD form",
            }}
            onSubmit={(values) => {
              const params = {
                cpu_over_commit_ratio: 1,
                memory_over_commit_ratio: 1,
                name: values.name,
                pool: values.pool,
                power_address: values.power_address,
                power_pass: values.power_pass,
                power_user: values.power_user,
                type: "rsd",
                zone: values.zone,
              };
              dispatch(podActions.create(params));
              setSavingPod(values.hostname || "Pod");
            }}
            resetOnSave={resetOnSave}
            saving={podSaving}
            saved={podSaved}
            savedRedirect={resetOnSave ? undefined : "/machines"}
            secondarySubmit={() => setResetOnSave(true)}
            secondarySubmitLabel="Save and add another"
            submitLabel="Save RSD"
            validationSchema={AddRSDSchema}
          >
            <AddRSDFormFields saved={podSaved} />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddRSDForm;
