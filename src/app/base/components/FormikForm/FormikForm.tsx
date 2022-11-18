import { Formik } from "formik";
import type { FormikConfig } from "formik";

import FormikFormContent from "app/base/components/FormikFormContent";
import type { Props as ContentProps } from "app/base/components/FormikFormContent/FormikFormContent";

export type Props<V extends object, E = null> = ContentProps<V, E> &
  FormikConfig<V>;

const FormikForm = <V extends object, E = null>({
  allowAllEmpty,
  allowUnchanged,
  buttonsAlign,
  buttonsBordered,
  buttonsClassName,
  buttonsHelp,
  cancelDisabled,
  children,
  className,
  cleanup,
  editable,
  errors,
  footer,
  inline,
  loading,
  onCancel,
  onSaveAnalytics,
  onSuccess,
  onValuesChanged,
  resetOnSave,
  saved,
  savedRedirect,
  saving,
  savingLabel,
  secondarySubmit,
  secondarySubmitDisabled,
  secondarySubmitLabel,
  secondarySubmitTooltip,
  submitAppearance,
  submitDisabled,
  submitLabel,
  "aria-label": ariaLabel,
  ...formikProps
}: Props<V, E>): JSX.Element => {
  return (
    <Formik<V> {...formikProps}>
      <FormikFormContent<V, E>
        allowAllEmpty={allowAllEmpty}
        allowUnchanged={allowUnchanged}
        aria-label={ariaLabel}
        buttonsAlign={buttonsAlign}
        buttonsBordered={buttonsBordered}
        buttonsClassName={buttonsClassName}
        buttonsHelp={buttonsHelp}
        cancelDisabled={cancelDisabled}
        className={className}
        cleanup={cleanup}
        editable={editable}
        errors={errors}
        footer={footer}
        inline={inline}
        loading={loading}
        onCancel={onCancel}
        onSaveAnalytics={onSaveAnalytics}
        onSuccess={onSuccess}
        onValuesChanged={onValuesChanged}
        resetOnSave={resetOnSave}
        saved={saved}
        savedRedirect={savedRedirect}
        saving={saving}
        savingLabel={savingLabel}
        secondarySubmit={secondarySubmit}
        secondarySubmitDisabled={secondarySubmitDisabled}
        secondarySubmitLabel={secondarySubmitLabel}
        secondarySubmitTooltip={secondarySubmitTooltip}
        submitAppearance={submitAppearance}
        submitDisabled={submitDisabled}
        submitLabel={submitLabel}
      >
        {children}
      </FormikFormContent>
    </Formik>
  );
};

export default FormikForm;
