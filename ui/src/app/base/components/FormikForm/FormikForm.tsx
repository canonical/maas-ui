import type { ReactNode } from "react";
import { useEffect } from "react";

import { Formik } from "formik";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useSendAnalyticsWhen } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";

type Props = {
  allowAllEmpty?: boolean;
  allowUnchanged?: boolean;
  Buttons?: JSX.Element;
  buttonsBordered?: boolean;
  buttonsHelpLabel?: string;
  buttonsHelpLink?: string;
  cleanup?: () => void;
  children?: ReactNode;
  errors?: TSFixMe;
  initialValues: TSFixMe;
  inline?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onSaveAnalytics?: {
    action?: string;
    category?: string;
    label?: string;
  };
  onSubmit: (values?: TSFixMe, formikBag?: TSFixMe) => void;
  onValuesChanged?: (values: TSFixMe) => void;
  resetOnSave?: boolean;
  saving?: boolean;
  savingLabel?: string;
  saved?: boolean;
  savedRedirect?: string;
  secondarySubmit?: () => void;
  secondarySubmitLabel?: string;
  submitAppearance?: string;
  submitLabel?: string;
  validationSchema?: TSFixMe;
  [x: string]: TSFixMe;
};

const FormikForm = ({
  allowAllEmpty,
  allowUnchanged,
  buttons,
  buttonsBordered = true,
  buttonsHelpLabel,
  buttonsHelpLink,
  cleanup,
  children,
  errors,
  inline,
  initialValues,
  loading,
  onCancel,
  onSaveAnalytics = {},
  onSubmit,
  onValuesChanged,
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
}: Props): JSX.Element => {
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
      <FormikFormContent
        allowAllEmpty={allowAllEmpty}
        allowUnchanged={allowUnchanged}
        buttonsBordered={buttonsBordered}
        buttonsHelpLabel={buttonsHelpLabel}
        buttonsHelpLink={buttonsHelpLink}
        buttons={buttons}
        errors={errors}
        inline={inline}
        initialValues={initialValues}
        onCancel={onCancel}
        onValuesChanged={onValuesChanged}
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
