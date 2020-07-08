import { Spinner } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  general as generalActions,
  pod as podActions,
  resourcepool as resourcePoolActions,
  zone as zoneActions,
} from "app/base/actions";
import generalSelectors from "app/store/general/selectors";
import podSelectors from "app/store/pod/selectors";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";
import {
  useAddMessage,
  useAllPowerParameters,
  usePowerParametersSchema,
  useWindowTitle,
} from "app/base/hooks";
import type { PowerType } from "app/store/general/types";
import type { TSFixMe } from "app/base/types";
import { formatErrors, formatPowerParameters } from "app/utils";
import AddKVMFormFields from "./AddKVMFormFields";
import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";

const generateAddKVMSchema = (parametersSchema: TSFixMe) =>
  Yup.object().shape({
    name: Yup.string(),
    pool: Yup.string().required("Resource pool required"),
    power_parameters: Yup.object().shape(parametersSchema),
    type: Yup.string().required("KVM host type required"),
    zone: Yup.string().required("Zone required"),
  });

export type AddKVMFormValues = { [x: string]: TSFixMe };

export const AddKVMForm = (): JSX.Element => {
  const dispatch = useDispatch();

  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const podErrors = useSelector(podSelectors.errors);
  const powerTypes: TSFixMe = useSelector(generalSelectors.powerTypes.get);
  const powerTypesLoaded = useSelector(generalSelectors.powerTypes.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const [hostType, setHostType] = useState("");
  const [savingPod, setSavingPod] = useState(false);

  const allLoaded = powerTypesLoaded && resourcePoolsLoaded && zonesLoaded;
  const initialHostType = "virsh";

  // Fetch all data required for the form.
  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  // Set host type in component state once power types have loaded, in order to
  // be able to correctly format power parameters on form submit.
  useEffect(() => {
    const initialHostPowerType = powerTypes.find(
      (type: PowerType) => type.name === initialHostType
    );
    if (initialHostPowerType && !hostType) {
      setHostType(initialHostPowerType);
    }
  }, [hostType, powerTypes]);

  useWindowTitle("Add KVM");

  useAddMessage(
    podSaved,
    podActions.cleanup,
    `${savingPod} added successfully.`,
    setSavingPod
  );

  const AddKVMSchema = usePowerParametersSchema(
    hostType,
    generateAddKVMSchema,
    true
  );

  const allPowerParameters = useAllPowerParameters(powerTypes);
  const errors = formatErrors(podErrors);

  return (
    <>
      {!allLoaded ? (
        <Spinner className="u-no-margin u-no-padding" text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add KVM">
          <FormikForm
            buttons={FormCardButtons}
            cleanup={podActions.cleanup}
            errors={errors}
            initialValues={{
              name: "",
              pool: resourcePools.length ? resourcePools[0].id : "",
              power_parameters: allPowerParameters,
              type: initialHostType,
              zone: zones.length ? zones[0].id : "",
            }}
            onSaveAnalytics={{
              action: "Save",
              category: "KVM",
              label: "Add KVM form",
            }}
            onSubmit={(values: AddKVMFormValues) => {
              const params = {
                name: values.name,
                pool: values.pool,
                type: values.type,
                zone: values.zone,
                ...formatPowerParameters(
                  hostType,
                  values.power_parameters,
                  "pod"
                ),
              };
              dispatch(podActions.create(params));
              setSavingPod(values.name || "VM host");
            }}
            onValuesChanged={(values: AddKVMFormValues) => {
              const hostType = powerTypes.find(
                (type: PowerType) => type.name === values.type
              );
              setHostType(hostType);
            }}
            saving={podSaving}
            saved={podSaved}
            savedRedirect="/kvm"
            submitLabel="Save KVM"
            validationSchema={AddKVMSchema}
          >
            <AddKVMFormFields />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddKVMForm;
