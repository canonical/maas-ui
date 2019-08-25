import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import VMWareFormFields from "../VMWareFormFields";

const VMWareSchema = Yup.object().shape({
  vcenter_server: Yup.string(),
  vcenter_username: Yup.string(),
  vcenter_password: Yup.string(),
  vcenter_datacenter: Yup.string()
});

const VMWareForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  // const windowsKmsHost = useSelector(config.windowsKmsHost);
  const vCenterServer = useSelector(config.vCenterServer);
  const vCenterUsername = useSelector(config.vCenterUsername);
  const vCenterPassword = useSelector(config.vCenterPassword);
  const vCenterDatacenter = useSelector(config.vCenterDatacenter);

  return (
    <Formik
      initialValues={{
        vcenter_server: vCenterServer,
        vcenter_username: vCenterUsername,
        vcenter_password: vCenterPassword,
        vcenter_datacenter: vCenterDatacenter
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={VMWareSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <VMWareFormFields formikProps={formikProps} />
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            type="submit"
            disabled={saving || formikFormDisabled(formikProps)}
            loading={saving}
            success={saved}
          >
            Save
          </ActionButton>
        </Form>
      )}
    />
  );
};

export default VMWareForm;
