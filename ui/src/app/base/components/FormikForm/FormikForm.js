import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { useSendAnalytics } from "app/base/hooks";
import FormikFormContent from "app/base/components/FormikFormContent";

const FormikForm = ({
  allowAllEmpty,
  allowUnchanged,
  buttons,
  buttonsBordered = true,
  cleanup,
  children,
  errors,
  initialValues,
  onCancel,
  onSaveAnalytics = {},
  onSubmit,
  onValuesChanged,
  resetOnSave,
  loading,
  saving,
  saved,
  savedRedirect,
  secondarySubmit,
  secondarySubmitLabel,
  submitAppearance,
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
        allowUnchanged={allowUnchanged}
        buttonsBordered={buttonsBordered}
        buttons={buttons}
        errors={errors}
        initialValues={initialValues}
        onCancel={onCancel}
        onValuesChanged={onValuesChanged}
        resetOnSave={resetOnSave}
        loading={loading}
        saving={saving}
        saved={saved}
        secondarySubmit={secondarySubmit}
        secondarySubmitLabel={secondarySubmitLabel}
        submitAppearance={submitAppearance}
        submitLabel={submitLabel}
      >
        {children}
      </FormikFormContent>
    </Formik>
  );
};

FormikForm.propTypes = {
  allowAllEmpty: PropTypes.bool,
  allowUnchanged: PropTypes.bool,
  buttons: PropTypes.func,
  buttonsBordered: PropTypes.bool,
  cleanup: PropTypes.func,
  children: PropTypes.node,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSaveAnalytics: PropTypes.shape({
    category: PropTypes.string,
    action: PropTypes.string,
    label: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onValuesChanged: PropTypes.func,
  resetOnSave: PropTypes.bool,
  loading: PropTypes.bool,
  saving: PropTypes.bool,
  saved: PropTypes.bool,
  savedRedirect: PropTypes.string,
  secondarySubmit: PropTypes.func,
  secondarySubmitLabel: PropTypes.string,
  submitAppearance: PropTypes.string,
  submitLabel: PropTypes.string,
  validationSchema: PropTypes.object,
};

export default FormikForm;
