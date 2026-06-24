import type { ReactElement } from "react";

import * as Yup from "yup";

import { Entitlement } from "../../UserManagement/views/Groups/constants";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import {
  useGetConfiguration,
  useSetConfiguration,
} from "@/app/api/query/configurations";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import { hasPermissions } from "@/app/utils/permissions";

const ThirdPartyDriversSchema = Yup.object().shape({
  enable_third_party_drivers: Yup.boolean(),
});

export enum Labels {
  FormLabel = "Third-party drivers form",
  CheckboxLabel = "Enable the installation of proprietary drivers (i.e. HPVSA)",
}

const ThirdPartyDriversForm = (): ReactElement => {
  const { data, isPending, isSuccess } = useGetConfiguration({
    path: { name: ConfigNames.ENABLE_THIRD_PARTY_DRIVERS },
  });
  const eTag = data?.headers?.get("ETag");
  const enable_third_party_drivers = data?.value || false;
  const updateConfig = useSetConfiguration();
  const userEntitlements = useGetUserEntitlements();
  const canEdit = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_EDIT_BOOT_ENTITIES,
  ]);

  return (
    <FormikForm
      aria-label={Labels.FormLabel}
      cleanup={configActions.cleanup}
      editable={canEdit}
      errors={updateConfig.error}
      initialValues={{
        enable_third_party_drivers,
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Images settings",
        label: "Ubuntu form",
      }}
      onSubmit={(values, { resetForm }) => {
        updateConfig.mutate({
          headers: {
            ETag: eTag,
          },
          body: {
            value: values.enable_third_party_drivers,
          },
          path: {
            name: ConfigNames.ENABLE_THIRD_PARTY_DRIVERS,
          },
        });
        resetForm({ values });
      }}
      saved={isSuccess}
      saving={isPending}
      validationSchema={ThirdPartyDriversSchema}
    >
      <FormikField
        disabled={!canEdit}
        label={Labels.CheckboxLabel}
        name="enable_third_party_drivers"
        type="checkbox"
      />
    </FormikForm>
  );
};

export default ThirdPartyDriversForm;
