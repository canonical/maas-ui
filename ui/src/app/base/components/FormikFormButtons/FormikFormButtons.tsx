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

export const FormikFormButtons = <V,>({
  buttonsAlign = "right",
  buttonsBordered = true,
  buttonsClassName,
  buttonsHelp,
  cancelDisabled,
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
        appearance="neutral"
        className="formik-form-buttons__button"
        data-testid="secondary-submit"
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
        data-testid="buttons-wrapper"
      >
        {buttonsHelp && (
          <div className="formik-form-buttons__help" data-testid="buttons-help">
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
              className="formik-form-buttons__button"
              data-testid="cancel-action"
              disabled={cancelDisabled}
              onClick={
                onCancel ? () => onCancel(values, formikContext) : undefined
              }
              type="button"
            >
              Cancel
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
          data-testid="saving-label"
        >
          {savingLabel}
        </p>
      )}
    </>
  );
};

export default FormikFormButtons;
