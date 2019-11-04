import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const ThirdPartyFormFields = ({ formikProps }) => (
  <FormikField
    label="Enable the installation of proprietary drivers (i.e. HPVSA)"
    type="checkbox"
    name="enable_third_party_drivers"
    checked={formikProps.values.enable_third_party_drivers}
  />
);

ThirdPartyFormFields.propTypes = extendFormikShape({
  enable_third_party_drivers: PropTypes.bool
});

export default ThirdPartyFormFields;
