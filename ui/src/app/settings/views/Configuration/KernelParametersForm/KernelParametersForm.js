import { ActionButton, Form } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import KernelParametersFormFields from "../KernelParametersFormFields";

const KernelParametersSchema = Yup.object().shape({
  kernel_opts: Yup.string()
});

const KernelParametersForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const kernelParams = useSelector(configSelectors.kernelParams);

  return (
    <Formik
      initialValues={{
        kernel_opts: kernelParams
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={KernelParametersSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <KernelParametersFormFields formikProps={formikProps} />
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            type="submit"
            disabled={formikFormDisabled(formikProps)}
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

export default KernelParametersForm;
