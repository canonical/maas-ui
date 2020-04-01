import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const VMWareSchema = Yup.object().shape({
  vcenter_server: Yup.string(),
  vcenter_username: Yup.string(),
  vcenter_password: Yup.string(),
  vcenter_datacenter: Yup.string(),
});

const VMWareForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const vCenterServer = useSelector(configSelectors.vCenterServer);
  const vCenterUsername = useSelector(configSelectors.vCenterUsername);
  const vCenterPassword = useSelector(configSelectors.vCenterPassword);
  const vCenterDatacenter = useSelector(configSelectors.vCenterDatacenter);

  return (
    <FormikForm
      initialValues={{
        vcenter_server: vCenterServer,
        vcenter_username: vCenterUsername,
        vcenter_password: vCenterPassword,
        vcenter_datacenter: vCenterDatacenter,
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Images settings",
        label: "VMware form",
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      saving={saving}
      saved={saved}
      validationSchema={VMWareSchema}
    >
      <FormikField
        label="VMware vCenter server FQDN or IP address"
        type="text"
        name="vcenter_server"
        help="VMware vCenter server FQDN or IP address which is passed to a deployed VMware ESXi host."
      />
      <FormikField
        label="VMware vCenter username"
        type="text"
        name="vcenter_username"
        help="VMware vCenter server username which is passed to a deployed VMware ESXi host."
      />
      <FormikField
        label="VMware vCenter password"
        type="text"
        name="vcenter_password"
        help="VMware vCenter server password which is passed to a deployed VMware ESXi host."
      />
      <FormikField
        label="VMware vCenter datacenter"
        type="text"
        name="vcenter_datacenter"
        help="VMware vCenter datacenter which is passed to a deployed VMware ESXi host."
      />
    </FormikForm>
  );
};

export default VMWareForm;
