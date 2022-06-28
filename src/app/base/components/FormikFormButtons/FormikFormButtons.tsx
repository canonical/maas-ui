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
  buttonsAlign?: "left" | "right";
  buttonsBordered?: boolean;
  buttonsClassName?: string;
  buttonsHelp?: ReactNode;
  cancelDisabled?: boolean;
  cancelLabel?: string;
  inline?: boolean;
  onCancel?: FormikContextFunc<V> | null;
  saved?: boolean;
  saving?: boolean;
  savingLabel?: string | null;
  secondarySubmit?: FormikContextFunc<V> | null;
  secondarySubmitDisabled?: boolean;
  secondarySubmitLabel?: string | FormikContextFunc<V, string> | null;
  secondarySubmitTooltip?: string | null;
  submitAppearance?: ActionButtonProps["appearance"];
  submitDisabled?: boolean;
  submitLabel?: string;
};

export enum TestIds {
  ButtonsHelp = "buttons-help",
  ButtonsWrapper = "buttons-wrapper",
  CancelButton = "cancel-action",
  SavingLabel = "saving-label",
  SecondarySubmit = "secondary-submit",
}

export enum Label {
  CancelButton = "Cancel action",
}

export const FormikFormButtons = <V,>({
  buttonsAlign = "right",
  buttonsBordered = true,
  buttonsClassName,
  buttonsHelp,
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
}: Props<V>): JSX.Element => {
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
        disabled={secondarySubmitDisabled || submitDisabled}
        onClick={
          secondarySubmit
            ? () => secondarySubmit(values, formikContext)
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
          "is-bordered": buttonsBordered,
          "is-inline": inline,
        })}
        data-testid={TestIds.ButtonsWrapper}
      >
        {buttonsHelp && (
          <div
            className="formik-form-buttons__help"
            data-testid={TestIds.ButtonsHelp}
          >
            {buttonsHelp}
          </div>
        )}
        <div
          className={classNames("formik-form-buttons__container", {
            "u-align--right": buttonsAlign === "right",
          })}
        >
          {onCancel && (
            <Button
              appearance="base"
              aria-label={Label.CancelButton}
              className="formik-form-buttons__button"
              data-testid={TestIds.CancelButton}
              disabled={cancelDisabled}
              onClick={
                onCancel ? () => onCancel(values, formikContext) : undefined
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
