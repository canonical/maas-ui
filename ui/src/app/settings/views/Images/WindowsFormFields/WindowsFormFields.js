import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const WindowsFormFields = ({ formikProps }) => (
  <FormikField
    label="Windows KMS activation host"
    type="text"
    fieldKey="windows_kms_host"
    help="FQDN or IP address of the host that provides the KMS Windows activation service. (Only needed for Windows deployments using KMS activation.)"
    formikProps={formikProps}
  />
);

WindowsFormFields.propTypes = extendFormikShape({
  windows_kms_host: PropTypes.string
});

export default WindowsFormFields;
