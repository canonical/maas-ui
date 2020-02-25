import { ActionButton, Button } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import { useRouter } from "app/base/hooks";

export const FormCardButtons = ({
  loading,
  secondarySubmit,
  secondarySubmitLabel,
  submitDisabled,
  submitLabel,
  success
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
      {secondarySubmit && secondarySubmitLabel && (
        <Button
          appearance="neutral"
          className="u-no-margin--bottom"
          data-test="secondary-submit"
          disabled={submitDisabled}
          onClick={secondarySubmit}
          type="button"
        >
          {secondarySubmitLabel}
        </Button>
      )}
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

FormCardButtons.propTypes = {
  loading: PropTypes.bool,
  secondarySubmit: PropTypes.func,
  secondarySubmitLabel: PropTypes.string,
  submitDisabled: PropTypes.bool,
  submitLabel: PropTypes.string.isRequired,
  success: PropTypes.bool
};

export default FormCardButtons;
