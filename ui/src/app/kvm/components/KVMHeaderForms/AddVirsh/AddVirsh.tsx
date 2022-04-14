import { useCallback, useEffect, useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import AddVirshFields from "./AddVirshFields";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useAddMessage } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
import { actions as generalActions } from "app/store/general";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import { PowerFieldScope } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { PowerParameters } from "app/store/types/node";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

export type AddVirshValues = {
  name: string;
  pool: string | number;
  power_parameters: PowerParameters;
  type: Pod["type"];
  zone: string | number;
};

export const AddVirsh = ({ clearHeaderContent }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const podErrors = useSelector(podSelectors.errors);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const [savingPod, setSavingPod] = useState<string | null>(null);
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const initialPowerParameters = useInitialPowerParameters();
  const loaded = powerTypesLoaded && resourcePoolsLoaded && zonesLoaded;

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useAddMessage(
    podSaved,
    cleanup,
    `${savingPod} added successfully.`,
    clearHeaderContent
  );

  const virshPowerType = powerTypes.find(
    (powerType) => powerType.name === PodType.VIRSH
  );

  if (!loaded) {
    return (
      <Strip shallow>
        <Spinner className="u-no-margin u-no-padding" text="Loading" />
      </Strip>
    );
  }

  const powerParametersSchema = generatePowerParametersSchema(
    virshPowerType || null,
    [PowerFieldScope.BMC]
  );
  const AddVirshSchema: SchemaOf<AddVirshValues> = Yup.object()
    .shape({
      name: Yup.string(),
      pool: Yup.string().required("Resource pool required"),
      power_parameters: Yup.object().shape(powerParametersSchema),
      type: Yup.string().required("KVM host type required"),
      zone: Yup.string().required("Zone required"),
    })
    .defined();

  return (
    <Formik
      initialValues={{
        name: "",
        pool: resourcePools.length ? resourcePools[0].id : "",
        power_parameters: initialPowerParameters,
        type: PodType.VIRSH,
        zone: zones.length ? zones[0].id : "",
      }}
      onSubmit={(values) => {
        if (virshPowerType) {
          const params = {
            name: values.name,
            pool: Number(values.pool),
            type: values.type,
            zone: Number(values.zone),
            ...formatPowerParameters(virshPowerType, values.power_parameters, [
              PowerFieldScope.BMC,
            ]),
          };
          dispatch(podActions.create(params));
          setSavingPod(values.name || "virsh KVM host");
        }
      }}
      validationSchema={AddVirshSchema}
    >
      <FormikFormContent<AddVirshValues>
        cleanup={cleanup}
        errors={podErrors}
        onCancel={clearHeaderContent}
        onSaveAnalytics={{
          action: "Save virsh KVM",
          category: "Add KVM form",
          label: "Save KVM",
        }}
        saving={podSaving}
        saved={podSaved}
        submitDisabled={!virshPowerType}
        submitLabel="Save Virsh host"
      >
        {virshPowerType ? (
          <AddVirshFields />
        ) : (
          <Strip data-testid="virsh-unsupported" shallow>
            Virsh is not supported on this MAAS.
          </Strip>
        )}
      </FormikFormContent>
    </Formik>
  );
};

export default AddVirsh;
