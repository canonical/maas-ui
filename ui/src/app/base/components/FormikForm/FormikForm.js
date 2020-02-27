import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { useSendAnalytics } from "app/base/hooks";
import FormikFormContent from "app/base/components/FormikFormContent";

const FormikForm = ({
  allowAllEmpty,
  buttons,
  cleanup,
  children,
  errors,
  initialValues,
  onSaveAnalytics = {},
  onSubmit,
  onValuesChanged,
  saving,
  saved,
  savedRedirect,
  secondarySubmit,
  secondarySubmitLabel,
  submitLabel,
  validationSchema,
  ...props
}) => {
  const dispatch = useDispatch();

  useSendAnalytics(
    saved,
    onSaveAnalytics.category,
    onSaveAnalytics.action,
    onSaveAnalytics.label
  );

  useEffect(() => {
    return () => {
      cleanup && dispatch(cleanup());
    };
  }, [cleanup, dispatch]);

  if (savedRedirect && saved) {
    return <Redirect to={savedRedirect} />;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      {...props}
    >
      <FormikFormContent
        allowAllEmpty={allowAllEmpty}
        buttons={buttons}
        errors={errors}
        onValuesChanged={onValuesChanged}
        saving={saving}
        saved={saved}
        secondarySubmit={secondarySubmit}
        secondarySubmitLabel={secondarySubmitLabel}
        submitLabel={submitLabel}
      >
        {children}
      </FormikFormContent>
    </Formik>
  );
};

FormikForm.propTypes = {
  allowAllEmpty: PropTypes.bool,
  buttons: PropTypes.func,
  cleanup: PropTypes.func,
  children: PropTypes.node.isRequired,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object.isRequired,
  onSaveAnalytics: PropTypes.shape({
    category: PropTypes.string,
    action: PropTypes.string,
    label: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onValuesChanged: PropTypes.func,
  saving: PropTypes.bool,
  saved: PropTypes.bool,
  savedRedirect: PropTypes.string,
  secondarySubmit: PropTypes.func,
  secondarySubmitLabel: PropTypes.string,
  submitLabel: PropTypes.string,
  validationSchema: PropTypes.object.isRequired
};

export default FormikForm;
