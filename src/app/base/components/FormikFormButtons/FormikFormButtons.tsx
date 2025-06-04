import type { ReactNode } from "react";

import { ActionButton, Button, Tooltip } from "@canonical/react-components";
import type { ActionButtonProps } from "@canonical/react-components";
import classNames from "classnames";
import type { FormikContextType } from "formik";
import { useFormikContext } from "formik";

export type FormikContextFunc<V, R = void> = (
  values: V,
  formikContext: FormikContextType<V>
) => R;

export type Props<V> = {
  readonly buttonsClassName?: string;
  readonly buttonsHelp?: ReactNode;
  readonly buttonsHelpClassName?: string;
  readonly cancelDisabled?: boolean;
  readonly cancelLabel?: string;
  readonly inline?: boolean;
  readonly onCancel?: FormikContextFunc<V> | null;
  readonly saved?: boolean;
  readonly saving?: boolean;
  readonly savingLabel?: string | null;
  readonly secondarySubmit?: FormikContextFunc<V> | null;
  readonly secondarySubmitDisabled?: boolean;
  readonly secondarySubmitLabel?: FormikContextFunc<V, string> | string | null;
  readonly secondarySubmitTooltip?: string | null;
  readonly submitAppearance?: ActionButtonProps["appearance"];
  readonly submitDisabled?: boolean;
  readonly submitLabel?: string;
  /**
   * Determines the behavior of the primary and secondary submit buttons.
   * - "coupled" (default): The secondary submit button is disabled if the primary submit button is disabled.
   * - "independent": The secondary submit button's disabled state is controlled independently.
   */
  readonly buttonsBehavior?: "coupled" | "independent";
};

export enum TestIds {
  ButtonsHelp = "buttons-help",
  ButtonsWrapper = "buttons-wrapper",
  CancelButton = "cancel-action",
  SavingLabel = "saving-label",
  SecondarySubmit = "secondary-submit",
}

export enum Labels {
  Cancel = "Cancel",
  Submit = "Save",
}

export const FormikFormButtons = <V,>({
  buttonsClassName,
  buttonsHelp,
  buttonsHelpClassName,
  cancelDisabled,
  cancelLabel = "Cancel",
  inline,
  onCancel,
  saved,
  saving,
  savingLabel,
  secondarySubmit,
  secondarySubmitDisabled,
  secondarySubmitLabel,
  secondarySubmitTooltip,
  submitAppearance = "positive",
  submitDisabled,
  submitLabel = "Save",
  buttonsBehavior = "coupled",
}: Props<V>): React.ReactElement => {
  const formikContext = useFormikContext<V>();
  const { values } = formikContext;
  const showSecondarySubmit = Boolean(secondarySubmit && secondarySubmitLabel);

  let secondaryButton: ReactNode;
  if (showSecondarySubmit) {
    const secondaryLabel =
      typeof secondarySubmitLabel === "function"
        ? secondarySubmitLabel(values, formikContext)
        : secondarySubmitLabel;
    const button = (
      <Button
        className="formik-form-buttons__button"
        data-testid={TestIds.SecondarySubmit}
        disabled={
          buttonsBehavior === "coupled"
            ? secondarySubmitDisabled || submitDisabled
            : secondarySubmitDisabled
        }
        onClick={
          secondarySubmit
            ? () => {
                secondarySubmit(values, formikContext);
              }
            : undefined
        }
        type="button"
      >
        {secondaryLabel}
      </Button>
    );
    if (secondarySubmitTooltip) {
      secondaryButton = (
        <Tooltip
          message={secondarySubmitTooltip}
          position="top-center"
          positionElementClassName="u-nudge-left"
        >
          {button}
        </Tooltip>
      );
    } else {
      secondaryButton = button;
    }
  }

  return (
    <>
      <div
        className={classNames("formik-form-buttons", buttonsClassName, {
          "is-inline": inline,
        })}
        data-testid={TestIds.ButtonsWrapper}
      >
        {buttonsHelp && (
          <div
            className={classNames(
              "formik-form-buttons__help",
              buttonsHelpClassName
            )}
            data-testid={TestIds.ButtonsHelp}
          >
            {buttonsHelp}
          </div>
        )}
        {onCancel && (
          <Button
            appearance="base"
            className="formik-form-buttons__button"
            data-testid={TestIds.CancelButton}
            disabled={cancelDisabled}
            onClick={
              onCancel
                ? () => {
                    onCancel(values, formikContext);
                  }
                : undefined
            }
            type="button"
          >
            {cancelLabel}
          </Button>
        )}
        {secondaryButton}
        <ActionButton
          appearance={submitAppearance}
          className="formik-form-buttons__button"
          disabled={submitDisabled}
          loading={saving}
          success={saved}
          type="submit"
        >
          {submitLabel}
        </ActionButton>
      </div>
      {saving && savingLabel && (
        <p
          className="u-text--light u-align-text--right"
          data-testid={TestIds.SavingLabel}
        >
          {savingLabel}
        </p>
      )}
    </>
  );
};

export default FormikFormButtons;
