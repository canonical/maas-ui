import type { ReactElement } from "react";

import * as Yup from "yup";

import { Entitlement } from "../../UserManagement/views/Groups/constants";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import {
  useBulkSetConfigurations,
  useConfigurations,
} from "@/app/api/query/configurations";
import type { PublicConfigName } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { getConfigsFromResponse } from "@/app/settings/utils";
import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import { hasPermissions } from "@/app/utils/permissions";

const VMWareSchema = Yup.object().shape({
  vcenter_server: Yup.string(),
  vcenter_username: Yup.string(),
  vcenter_password: Yup.string(),
  vcenter_datacenter: Yup.string(),
});

export enum Labels {
  FormLabel = "VMWare Form",
  ServerLabel = "VMware vCenter server FQDN or IP address",
  UsernameLabel = "VMware vCenter username",
  PasswordLabel = "VMware vCenter password",
  DatacenterLabel = "VMware vCenter datacenter",
}

const VMWareForm = (): ReactElement => {
  const names = [
    ConfigNames.VCENTER_SERVER,
    ConfigNames.VCENTER_USERNAME,
    ConfigNames.VCENTER_PASSWORD,
    ConfigNames.VCENTER_DATACENTER,
  ] as PublicConfigName[];
  const { data, isPending, isSuccess } = useConfigurations({
    query: { name: names },
  });
  const eTag = data?.headers?.get("ETag");
  const {
    vcenter_server,
    vcenter_username,
    vcenter_password,
    vcenter_datacenter,
  } = getConfigsFromResponse(data?.items || [], names);
  const updateConfig = useBulkSetConfigurations();
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
        vcenter_server: vcenter_server ?? "",
        vcenter_username: vcenter_username ?? "",
        vcenter_password: vcenter_password ?? "",
        vcenter_datacenter: vcenter_datacenter ?? "",
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Images settings",
        label: "VMware form",
      }}
      onSubmit={(values, { resetForm }) => {
        updateConfig.mutate({
          headers: {
            ETag: eTag,
          },
          body: {
            configurations: [
              {
                name: ConfigNames.VCENTER_SERVER,
                value: values.vcenter_server,
              },
              {
                name: ConfigNames.VCENTER_USERNAME,
                value: values.vcenter_username,
              },
              {
                name: ConfigNames.VCENTER_PASSWORD,
                value: values.vcenter_password,
              },
              {
                name: ConfigNames.VCENTER_DATACENTER,
                value: values.vcenter_datacenter,
              },
            ],
          },
        });
        resetForm({ values });
      }}
      saved={isSuccess}
      saving={isPending}
      validationSchema={VMWareSchema}
    >
      <FormikField
        disabled={!canEdit}
        help="VMware vCenter server FQDN or IP address which is passed to a deployed VMware ESXi host."
        label={Labels.ServerLabel}
        name="vcenter_server"
        type="text"
      />
      <FormikField
        disabled={!canEdit}
        help="VMware vCenter server username which is passed to a deployed VMware ESXi host."
        label={Labels.UsernameLabel}
        name="vcenter_username"
        type="text"
      />
      <FormikField
        disabled={!canEdit}
        help="VMware vCenter server password which is passed to a deployed VMware ESXi host."
        label={Labels.PasswordLabel}
        name="vcenter_password"
        type="password"
      />
      <FormikField
        disabled={!canEdit}
        help="VMware vCenter datacenter which is passed to a deployed VMware ESXi host."
        label={Labels.DatacenterLabel}
        name="vcenter_datacenter"
        type="text"
      />
    </FormikForm>
  );
};

export default VMWareForm;
