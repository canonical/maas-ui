import type { ReactNode } from "react";

import {
  ActionButton,
  Button,
  Link,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";

import type { ButtonComponentProps } from "app/base/components/FormikFormContent/FormikFormContent";

export const FormCardButtons = ({
  bordered = true,
  helpLabel,
  helpLink,
  loading,
  loadingLabel,
  onCancel,
  secondarySubmit,
  secondarySubmitDisabled,
  secondarySubmitLabel,
  secondarySubmitTooltip,
  submitAppearance = "positive",
  submitDisabled,
  submitLabel,
  success,
}: ButtonComponentProps): JSX.Element => {
  let secondaryButton: ReactNode;
  if (secondarySubmit && secondarySubmitLabel) {
    const button = (
      <Button
        appearance="neutral"
        className={classNames({ "u-no-margin--bottom": bordered })}
        data-test="secondary-submit"
        disabled={secondarySubmitDisabled || submitDisabled}
        onClick={secondarySubmit}
        type="button"
      >
        {secondarySubmitLabel}
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
      {bordered && <hr />}
      <div
        className={classNames("form-card__buttons", {
          "is-bordered": bordered,
        })}
      >
        {helpLink && helpLabel ? (
          <p className="u-no-margin--bottom form-card__buttons-help">
            <Link
              external
              href={helpLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              {helpLabel}
            </Link>
          </p>
        ) : null}
        {onCancel && (
          <Button
            appearance="base"
            className={classNames({ "u-no-margin--bottom": bordered })}
            data-test="cancel-action"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
        )}
        {secondaryButton}
        <ActionButton
          appearance={submitAppearance}
          className={classNames({ "u-no-margin--bottom": bordered })}
          disabled={submitDisabled}
          loading={loading}
          success={success}
          type="submit"
        >
          {submitLabel}
        </ActionButton>
      </div>
      {loading && loadingLabel && (
        <p
          className="u-text--light u-align-text--right"
          data-test="loading-label"
        >
          {loadingLabel}
        </p>
      )}
    </>
  );
};

FormCardButtons.propTypes = {
  bordered: PropTypes.bool,
  helpLabel: PropTypes.string,
  helpLink: PropTypes.string,
  loading: PropTypes.bool,
  loadingLabel: PropTypes.string,
  onCancel: PropTypes.func,
  secondarySubmit: PropTypes.func,
  secondarySubmitLabel: PropTypes.string,
  submitAppearance: PropTypes.string,
  submitDisabled: PropTypes.bool,
  submitLabel: PropTypes.string.isRequired,
  success: PropTypes.bool,
};

export default FormCardButtons;
