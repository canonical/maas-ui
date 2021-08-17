import { Formik } from "formik";
import type { FormikConfig } from "formik";

import FormikFormContent from "app/base/components/FormikFormContent";
import type { Props as ContentProps } from "app/base/components/FormikFormContent/FormikFormContent";

export type Props<V> = ContentProps<V> & FormikConfig<V>;

const FormikForm = <V,>({
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
  ...formikProps
}: Props<V>): JSX.Element => {
  return (
    <Formik<V> {...formikProps}>
      <FormikFormContent<V>
        allowAllEmpty={allowAllEmpty}
        allowUnchanged={allowUnchanged}
        buttonsAlign={buttonsAlign}
        buttonsBordered={buttonsBordered}
        buttonsClassName={buttonsClassName}
        buttonsHelp={buttonsHelp}
        cancelDisabled={cancelDisabled}
        className={className}
        cleanup={cleanup}
        editable={editable}
        errors={errors}
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
