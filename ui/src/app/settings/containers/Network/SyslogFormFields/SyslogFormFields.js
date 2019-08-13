import React from "react";
import PropTypes from "prop-types";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const SyslogFormFields = ({ formikProps }) => {
  return (
    <>
      <FormikField
        formikProps={formikProps}
        fieldKey="remote_syslog"
        label="Remote syslog server to forward machine logs"
        help="A remote syslog server that MAAS will set on enlisting, commissioning, testing, and deploying machines to send all log messages. Clearing this value will restore the default behaviour of forwarding syslog to MAAS."
        type="text"
      />
    </>
  );
};

SyslogFormFields.propTypes = extendFormikShape({
  remote_syslog: PropTypes.string
});

export default SyslogFormFields;
