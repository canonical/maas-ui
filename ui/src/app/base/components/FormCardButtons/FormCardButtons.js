import { ActionButton, Button } from "@canonical/react-components";
import { useRouter } from "app/base/hooks";
import PropTypes from "prop-types";
import React from "react";

export const FormCardButtons = ({
  actionDisabled,
  actionLabel,
  actionLoading,
  actionSuccess
}) => {
  const { history } = useRouter();
  return (
    <div className="form-card__buttons">
      <Button
        appearance="base"
        className="u-no-margin--bottom"
        onClick={() => history.goBack()}
        type="button"
      >
        Cancel
      </Button>
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

FormCardButtons.propTypes = {
  actionDisabled: PropTypes.bool,
  actionLabel: PropTypes.string.isRequired,
  actionLoading: PropTypes.bool,
  actionSuccess: PropTypes.bool
};

export default FormCardButtons;
