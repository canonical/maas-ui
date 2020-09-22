import { Spinner } from "@canonical/react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import AddRSDFormFields from "./AddRSDFormFields";
import { general as generalActions } from "app/base/actions";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { formatErrors } from "app/utils";

const AddRSDFormSchema = Yup.object().shape({
  name: Yup.string(),
  pool: Yup.number(),
  power_address: Yup.string().required("Address required"),
  power_pass: Yup.string().required("Password required"),
  power_user: Yup.string().required("User required"),
  zone: Yup.number(),
});

export type AddRSDFormValues = {
  name: string;
  pool: number;
  power_address: string;
  power_pass: string;
  power_user: string;
  zone: number;
};

export const AddRSDForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const podErrors = useSelector(podSelectors.errors);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const [savingRSD, setSavingRSD] = useState("");

  const allLoaded = resourcePoolsLoaded && zonesLoaded;

  const cleanup = useCallback(() => podActions.cleanup(), []);

  // Fetch all data required for the form.
  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useWindowTitle("Add RSD");

  useAddMessage(
    podSaved,
    cleanup,
    `${savingRSD} added successfully.`,
    setSavingRSD
  );

  const errors = formatErrors(podErrors);

  return (
    <>
      {!allLoaded ? (
        <Spinner className="u-no-margin u-no-padding" text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add RSD">
          <FormikForm
            buttons={FormCardButtons}
            cleanup={cleanup}
            errors={errors}
            initialValues={{
              name: "",
              pool: (resourcePools.length && resourcePools[0].id) || 0,
              power_address: "",
              power_pass: "",
              power_user: "",
              zone: (zones.length && zones[0].id) || 0,
            }}
            onCancel={() => history.push({ pathname: "/rsd" })}
            onSaveAnalytics={{
              action: "Save",
              category: "RSD",
              label: "Add RSD form",
            }}
            onSubmit={(values: AddRSDFormValues) => {
              const params = {
                name: values.name,
                pool: Number(values.pool),
                power_address: values.power_address,
                power_pass: values.power_pass,
                power_user: values.power_user,
                type: "rsd",
                zone: Number(values.zone),
              };
              dispatch(podActions.create(params));
              setSavingRSD(values.name || "RSD");
            }}
            saving={podSaving}
            saved={podSaved}
            savedRedirect="/rsd"
            submitLabel="Save RSD"
            validationSchema={AddRSDFormSchema}
          >
            <AddRSDFormFields />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddRSDForm;
