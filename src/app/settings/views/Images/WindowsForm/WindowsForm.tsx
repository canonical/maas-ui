import type { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Entitlement } from "../../UserManagement/views/Groups/constants";

import { useGetConfiguration } from "@/app/api/query/configurations";
import type { PublicConfigName } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useHasEntitlements } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { ConfigNames } from "@/app/store/config/types";

const WindowsSchema = Yup.object().shape({
  windows_kms_host: Yup.string(),
});

export enum Labels {
  FormLabel = "Windows Form",
  KMSHostLabel = "Windows KMS activation host",
}

export const windowsConfigName =
  ConfigNames.WINDOWS_KMS_HOST as PublicConfigName;

const WindowsForm = (): ReactElement => {
  const dispatch = useDispatch();
  const { data } = useGetConfiguration({
    path: { name: windowsConfigName },
  });
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);
  const { allowed: canEdit } = useHasEntitlements([
    Entitlement.CAN_EDIT_CONFIGURATIONS,
  ]);

  return (
    <FormikForm
      aria-label={Labels.FormLabel}
      cleanup={configActions.cleanup}
      editable={canEdit}
      enableReinitialize
      errors={errors}
      initialValues={{
        windows_kms_host: (data?.value as string) ?? "",
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Images settings",
        label: "Windows form",
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(configActions.update(values));
        resetForm({ values });
      }}
      saved={saved}
      saving={saving}
      validationSchema={WindowsSchema}
    >
      <FormikField
        disabled={!canEdit}
        help="FQDN or IP address of the host that provides the KMS Windows activation service. (Only needed for Windows deployments using KMS activation.)"
        label={Labels.KMSHostLabel}
        name="windows_kms_host"
        type="text"
      />
    </FormikForm>
  );
};

export default WindowsForm;
