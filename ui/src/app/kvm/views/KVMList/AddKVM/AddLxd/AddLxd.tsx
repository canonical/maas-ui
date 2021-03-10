import { useCallback, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import type { SetKvmType } from "../AddKVM";

import AddLxdFields from "./AddLxdFields";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import { PowerFieldScope } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";

type Props = { setKvmType: SetKvmType };

export type AddLxdValues = { [x: string]: TSFixMe };

export const AddLxd = ({ setKvmType }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const podErrors = useSelector(podSelectors.errors);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const [savingPod, setSavingPod] = useState(false);
  const initialPowerParameters = useInitialPowerParameters();

  useAddMessage(podSaved, cleanup, `${savingPod} added successfully.`, () =>
    setSavingPod(false)
  );

  const lxdPowerType = powerTypes.find(
    (powerType) => powerType.name === PodType.LXD
  );

  if (!lxdPowerType) {
    return <Spinner className="u-no-margin u-no-padding" text="Loading" />;
  }

  const powerParametersSchema = generatePowerParametersSchema(lxdPowerType, [
    PowerFieldScope.BMC,
  ]);
  const AddLxdSchema: SchemaOf<AddLxdValues> = Yup.object()
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
      <FormikForm<AddLxdValues>
        buttons={FormCardButtons}
        cleanup={cleanup}
        errors={podErrors}
        initialValues={{
          name: "",
          pool: resourcePools.length ? resourcePools[0].id : "",
          power_parameters: initialPowerParameters,
          type: PodType.LXD,
          zone: zones.length ? zones[0].id : "",
        }}
        onCancel={() => history.push({ pathname: "/kvm" })}
        onSaveAnalytics={{
          action: "Save LXD KVM",
          category: "Add KVM form",
          label: "Save KVM",
        }}
        onSubmit={(values: AddLxdValues) => {
          const params = {
            name: values.name,
            pool: values.pool,
            type: values.type,
            zone: values.zone,
            ...formatPowerParameters(lxdPowerType, values.power_parameters, [
              PowerFieldScope.BMC,
            ]),
          };
          dispatch(podActions.create(params));
          setSavingPod(values.name || "LXD VM host");
        }}
        saving={podSaving}
        saved={podSaved}
        savedRedirect="/kvm"
        submitLabel="Save KVM"
        validationSchema={AddLxdSchema}
      >
        <AddLxdFields setKvmType={setKvmType} />
      </FormikForm>
    </FormCard>
  );
};

export default AddLxd;
