import { useEffect } from "react";

import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router";
import type { SchemaOf } from "yup";

import FormikFormContent from "app/base/components/FormikFormContent";
import type {
  Props as ContentProps,
  FormErrors,
} from "app/base/components/FormikFormContent/FormikFormContent";
import { useSendAnalyticsWhen } from "app/base/hooks";

export type Props<V, E = FormErrors> = {
  cleanup?: () => void;
  onSaveAnalytics?: {
    action?: string;
    category?: string;
    label?: string;
  };
  onSubmit: (values?: V, formikHelpers?: FormikHelpers<V>) => void;
  savedRedirect?: string;
  validationSchema?: SchemaOf<V>;
} & ContentProps<V, E>;

const FormikForm = <V, E = FormErrors>({
  allowAllEmpty,
  allowUnchanged,
  buttons,
  buttonsBordered = true,
  buttonsHelpLabel,
  buttonsHelpLink,
  cleanup,
  children,
  editable = true,
  errors,
  inline,
  initialValues,
  loading,
  onCancel,
  onSaveAnalytics = {},
  onSubmit,
  onValuesChanged,
  resetOnCancel,
  resetOnSave,
  saving,
  savingLabel,
  saved,
  savedRedirect,
  secondarySubmit,
  secondarySubmitLabel,
  submitAppearance,
  submitLabel,
  validationSchema,
  ...props
}: Props<V, E>): JSX.Element => {
  const dispatch = useDispatch();

  useSendAnalyticsWhen(
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
      <FormikFormContent<V, E>
        allowAllEmpty={allowAllEmpty}
        allowUnchanged={allowUnchanged}
        buttonsBordered={buttonsBordered}
        buttonsHelpLabel={buttonsHelpLabel}
        buttonsHelpLink={buttonsHelpLink}
        buttons={buttons}
        editable={editable}
        errors={errors}
        inline={inline}
        initialValues={initialValues}
        onCancel={onCancel}
        onValuesChanged={onValuesChanged}
        resetOnCancel={resetOnCancel}
        resetOnSave={resetOnSave}
        loading={loading}
        saving={saving}
        savingLabel={savingLabel}
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
  buttonsHelpLabel: PropTypes.string,
  buttonsHelpLink: PropTypes.string,
  buttonsBordered: PropTypes.bool,
  cleanup: PropTypes.func,
  children: PropTypes.node,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object.isRequired,
  inline: PropTypes.bool,
  onCancel: PropTypes.func,
  onSaveAnalytics: PropTypes.shape({
    category: PropTypes.string,
    action: PropTypes.string,
    label: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onValuesChanged: PropTypes.func,
  resetOnCancel: PropTypes.bool,
  resetOnSave: PropTypes.bool,
  loading: PropTypes.bool,
  saving: PropTypes.bool,
  savingLabel: PropTypes.string,
  saved: PropTypes.bool,
  savedRedirect: PropTypes.string,
  secondarySubmit: PropTypes.func,
  secondarySubmitLabel: PropTypes.string,
  submitAppearance: PropTypes.string,
  submitLabel: PropTypes.string,
  validationSchema: PropTypes.object,
};

export default FormikForm;
