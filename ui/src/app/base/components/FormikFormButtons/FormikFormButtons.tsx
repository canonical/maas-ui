import type { ReactNode } from "react";

import {
  ActionButton,
  Button,
  Link,
  Tooltip,
} from "@canonical/react-components";
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
  buttonsHelpLabel?: string;
  buttonsHelpLink?: string;
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
  buttonsHelpLabel,
  buttonsHelpLink,
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
  const showHelpLink = Boolean(buttonsHelpLink && buttonsHelpLabel);

  let secondaryButton: ReactNode;
  if (showSecondarySubmit) {
    const secondaryLabel =
      typeof secondarySubmitLabel === "function"
        ? secondarySubmitLabel(values, formikContext)
        : secondarySubmitLabel;
    const button = (
      <Button
        appearance="neutral"
        className={classNames({ "u-no-margin--bottom": buttonsBordered })}
        data-test="secondary-submit"
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
      {buttonsBordered && <hr />}
      <div
        className={classNames(buttonsClassName, {
          "u-flex--between":
            !inline && (buttonsAlign === "right" || showHelpLink),
        })}
      >
        <p className="u-no-margin--bottom u-no-max-width">
          {showHelpLink ? (
            <Link
              external
              href={buttonsHelpLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              {buttonsHelpLabel}
            </Link>
          ) : null}
        </p>
        <div>
          {onCancel && (
            <Button
              appearance="base"
              className={classNames({
                "u-no-margin--bottom": buttonsBordered || inline,
              })}
              data-test="cancel-action"
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
            className={classNames({
              "u-no-margin--bottom": buttonsBordered || inline,
            })}
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
          data-test="saving-label"
        >
          {savingLabel}
        </p>
      )}
    </>
  );
};

export default FormikFormButtons;
