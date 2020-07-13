import { ActionButton, Button } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

export const FormCardButtons = ({
  bordered = true,
  loading,
  loadingLabel,
  onCancel,
  secondarySubmit,
  secondarySubmitLabel,
  submitAppearance = "positive",
  submitDisabled,
  submitLabel,
  success,
}) => {
  return (
    <>
      {bordered && <hr />}
      <div
        className={classNames("form-card__buttons", {
          "is-bordered": bordered,
        })}
      >
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
        {secondarySubmit && secondarySubmitLabel && (
          <Button
            appearance="neutral"
            className={classNames({ "u-no-margin--bottom": bordered })}
            data-test="secondary-submit"
            disabled={submitDisabled}
            onClick={secondarySubmit}
            type="button"
          >
            {secondarySubmitLabel}
          </Button>
        )}
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
