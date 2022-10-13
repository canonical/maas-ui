import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

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

const VMWareForm = (): JSX.Element => {
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
      aria-label={Labels.FormLabel}
      buttonsAlign="left"
      buttonsBordered={false}
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
      saved={saved}
      saving={saving}
      validationSchema={VMWareSchema}
    >
      <FormikField
        help="VMware vCenter server FQDN or IP address which is passed to a deployed VMware ESXi host."
        label={Labels.ServerLabel}
        name="vcenter_server"
        type="text"
      />
      <FormikField
        help="VMware vCenter server username which is passed to a deployed VMware ESXi host."
        label={Labels.UsernameLabel}
        name="vcenter_username"
        type="text"
      />
      <FormikField
        help="VMware vCenter server password which is passed to a deployed VMware ESXi host."
        label={Labels.PasswordLabel}
        name="vcenter_password"
        type="password"
      />
      <FormikField
        help="VMware vCenter datacenter which is passed to a deployed VMware ESXi host."
        label={Labels.DatacenterLabel}
        name="vcenter_datacenter"
        type="text"
      />
    </FormikForm>
  );
};

export default VMWareForm;
