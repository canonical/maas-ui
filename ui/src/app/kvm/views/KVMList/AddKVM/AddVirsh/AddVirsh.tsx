import { useCallback, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import type { SetKvmType } from "../AddKVM";

import AddVirshFields from "./AddVirshFields";

import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage } from "app/base/hooks";
import kvmURLs from "app/kvm/urls";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import { PowerFieldScope } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import type { PowerParameters } from "app/store/machine/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";

type Props = { setKvmType: SetKvmType };

export type AddVirshValues = {
  name: string;
  pool: string | number;
  power_parameters: PowerParameters;
  type: PodType;
  zone: string | number;
};

export const AddVirsh = ({ setKvmType }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const podErrors = useSelector(podSelectors.errors);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const [savingPod, setSavingPod] = useState<string | null>(null);
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const initialPowerParameters = useInitialPowerParameters();

  useAddMessage(podSaved, cleanup, `${savingPod} added successfully.`, () =>
    setSavingPod(null)
  );

  const virshPowerType = powerTypes.find(
    (powerType) => powerType.name === PodType.VIRSH
  );

  if (!virshPowerType) {
    return <Spinner className="u-no-margin u-no-padding" text="Loading" />;
  }

  const powerParametersSchema = generatePowerParametersSchema(virshPowerType, [
    PowerFieldScope.BMC,
  ]);
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
    <FormCard sidebar={false} title="Add KVM">
      <FormikForm<AddVirshValues>
        cleanup={cleanup}
        errors={podErrors}
        initialValues={{
          name: "",
          pool: resourcePools.length ? resourcePools[0].id : "",
          power_parameters: initialPowerParameters,
          type: PodType.VIRSH,
          zone: zones.length ? zones[0].id : "",
        }}
        onCancel={() => history.push({ pathname: kvmURLs.kvm })}
        onSaveAnalytics={{
          action: "Save virsh KVM",
          category: "Add KVM form",
          label: "Save KVM",
        }}
        onSubmit={(values) => {
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
          setSavingPod(values.name || "virsh VM host");
        }}
        saving={podSaving}
        saved={podSaved}
        savedRedirect={kvmURLs.kvm}
        submitLabel="Save KVM"
        validationSchema={AddVirshSchema}
      >
        <AddVirshFields setKvmType={setKvmType} />
      </FormikForm>
    </FormCard>
  );
};

export default AddVirsh;
