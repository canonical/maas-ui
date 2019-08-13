import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { extendFormikShape } from "app/settings/proptypes";
import config from "app/settings/selectors/config";
import FormikField from "app/base/components/FormikField";
import Select from "app/base/components/Select";

const DnsFormFields = ({ formikProps }) => {
  const dnssecOptions = useSelector(config.dnssecOptions);

  return (
    <>
      <FormikField
        formikProps={formikProps}
        fieldKey="upstream_dns"
        label="Upstream DNS used to resolve domains not managed by this MAAS (space-separated IP addresses)"
        help="Only used when MAAS is running its own DNS server. This value is used as the value of 'forwarders' in the DNS server config."
        type="text"
      />
      <FormikField
        formikProps={formikProps}
        component={Select}
        options={dnssecOptions}
        fieldKey="dnssec_validation"
        label="Enable DNSSEC validation of upstream zones"
        help="Only used when MAAS is running its own DNS server. This value is used as the value of 'dnssec_validation' in the DNS server config."
      />
      <FormikField
        formikProps={formikProps}
        fieldKey="dns_trusted_acl"
        label="List of external networks (not previously known), that will be allowed to use MAAS for DNS resolution"
        help="MAAS keeps a list of networks that are allowed to use MAAS for DNS resolution. This option allows to add extra networks (not previously known) to the trusted ACL where this list of networks is kept. It also supports specifying IPs or ACL names."
        type="text"
      />
    </>
  );
};

DnsFormFields.propTypes = extendFormikShape({
  dnssec_validation: PropTypes.string,
  dns_trusted_acl: PropTypes.string,
  upstream_dns: PropTypes.string
});

export default DnsFormFields;
