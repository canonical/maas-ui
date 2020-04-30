import { ActionButton, Button } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { useRouter } from "app/base/hooks";

export const FormCardButtons = ({
  bordered = true,
  loading,
  onCancel,
  secondarySubmit,
  secondarySubmitLabel,
  submitAppearance = "positive",
  submitDisabled,
  submitLabel,
  success,
}) => {
  const { history } = useRouter();

  return (
    <>
      {bordered && <hr />}
      <div
        className={classNames("form-card__buttons", {
          "is-bordered": bordered,
        })}
      >
        <Button
          appearance="base"
          className={classNames({ "u-no-margin--bottom": bordered })}
          data-test="cancel-action"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              history.goBack();
            }
          }}
          type="button"
        >
          Cancel
        </Button>
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
    </>
  );
};

FormCardButtons.propTypes = {
  bordered: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  secondarySubmit: PropTypes.func,
  secondarySubmitLabel: PropTypes.string,
  submitAppearance: PropTypes.string,
  submitDisabled: PropTypes.bool,
  submitLabel: PropTypes.string.isRequired,
  success: PropTypes.bool,
};

export default FormCardButtons;
