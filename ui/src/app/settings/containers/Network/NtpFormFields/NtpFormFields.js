import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const NtpFormFields = ({ formikProps }) => {
  const { values } = formikProps;

  return (
    <>
      <FormikField
        formikProps={formikProps}
        fieldKey="ntp_servers"
        label="Addresses of NTP servers"
        help="NTP servers, specified as IP addresses or hostnames delimited by commas and/or spaces, to be used as time references for MAAS itself, the machines MAAS deploys, and devices that make use of MAAS's DHCP services."
        type="text"
      />
      <FormikField
        formikProps={formikProps}
        fieldKey="ntp_external_only"
        label="Use external NTP servers only"
        help="Configure all region controller hosts, rack controller hosts, and subsequently deployed machines to refer directly to the configured external NTP servers. Otherwise only region controller hosts will be configured to use those external NTP servers, rack contoller hosts will in turn refer to the regions' NTP servers, and deployed machines will refer to the racks' NTP servers."
        type="checkbox"
        checked={values.ntp_external_only}
      />
    </>
  );
};

NtpFormFields.propTypes = extendFormikShape({
  ntp_external_only: PropTypes.bool,
  ntp_servers: PropTypes.string
});

export default NtpFormFields;
