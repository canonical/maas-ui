import { ActionButton, Button } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

export const FormikFormButtons = ({
  cancelDisabled,
  loading,
  onCancel,
  submitDisabled,
  submitLabel,
  success,
}) => {
  return (
    <div>
      {onCancel ? (
        <Button
          appearance="base"
          className="u-no-margin--bottom"
          disabled={cancelDisabled}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
      ) : null}
      <ActionButton
        appearance="positive"
        className="u-no-margin--bottom"
        disabled={submitDisabled}
        loading={loading}
        success={success}
        type="submit"
      >
        {submitLabel}
      </ActionButton>
    </div>
  );
};

FormikFormButtons.propTypes = {
  cancelDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  submitDisabled: PropTypes.bool,
  submitLabel: PropTypes.string.isRequired,
  success: PropTypes.bool,
};

export default FormikFormButtons;
