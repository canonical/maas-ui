import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import FormikFormContent from "app/base/components/FormikFormContent";

const FormikForm = ({
  buttons,
  cleanup,
  children,
  errors,
  initialValues,
  onSubmit,
  onValuesChanged,
  saving,
  saved,
  savedRedirect,
  submitLabel,
  validationSchema,
  ...props
}) => {
  const dispatch = useDispatch();

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
        buttons={buttons}
        errors={errors}
        onValuesChanged={onValuesChanged}
        saving={saving}
        saved={saved}
        submitLabel={submitLabel}
      >
        {children}
      </FormikFormContent>
    </Formik>
  );
};

FormikForm.propTypes = {
  buttons: PropTypes.func,
  cleanup: PropTypes.func,
  children: PropTypes.node.isRequired,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onValuesChanged: PropTypes.func,
  saving: PropTypes.bool,
  saved: PropTypes.bool,
  savedRedirect: PropTypes.string,
  submitLabel: PropTypes.string,
  validationSchema: PropTypes.object.isRequired
};

export default FormikForm;
