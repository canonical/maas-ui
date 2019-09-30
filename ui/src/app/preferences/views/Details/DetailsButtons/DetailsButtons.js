import PropTypes from "prop-types";
import React from "react";

import ActionButton from "app/base/components/ActionButton";

export const DetailsButtons = ({
  actionDisabled,
  actionLabel,
  actionLoading,
  actionSuccess,
  showCancel
}) => {
  return (
    <div style={{ marginTop: "1rem" }}>
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

DetailsButtons.propTypes = {
  actionDisabled: PropTypes.bool,
  actionLabel: PropTypes.string.isRequired,
  actionLoading: PropTypes.bool,
  actionSuccess: PropTypes.bool
};

export default DetailsButtons;
