import { ActionButton } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

export const FormikFormButtons = ({
  loading,
  submitDisabled,
  submitLabel,
  success,
}) => {
  return (
    <div>
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
  loading: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  submitLabel: PropTypes.string.isRequired,
  success: PropTypes.bool,
};

export default FormikFormButtons;
