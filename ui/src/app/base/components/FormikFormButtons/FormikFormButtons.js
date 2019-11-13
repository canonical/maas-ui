import { ActionButton } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

export const FormikFormButtons = ({
  actionDisabled,
  actionLabel,
  actionLoading,
  actionSuccess
}) => {
  return (
    <div>
      <ActionButton
        appearance="positive"
        className="u-no-margin--bottom"
        disabled={actionDisabled}
        loading={actionLoading}
        success={actionSuccess}
        type="submit"
      >
        {actionLabel}
      </ActionButton>
    </div>
  );
};

FormikFormButtons.propTypes = {
  actionDisabled: PropTypes.bool,
  actionLabel: PropTypes.string.isRequired,
  actionLoading: PropTypes.bool,
  actionSuccess: PropTypes.bool
};

export default FormikFormButtons;
