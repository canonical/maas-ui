import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { extendFormikShape } from "app/settings/proptypes";
import config from "app/settings/selectors/config";
import FormikField from "app/base/components/FormikField";
import Select from "app/base/components/Select";

const NetworkDiscoveryFormFields = ({ formikProps }) => {
  const networkDiscoveryOptions = useSelector(config.networkDiscoveryOptions);
  const discoveryIntervalOptions = useSelector(config.discoveryIntervalOptions);

  return (
    <>
      <FormikField
        formikProps={formikProps}
        component={Select}
        options={networkDiscoveryOptions}
        fieldKey="network_discovery"
        label="Network discovery"
        help="When enabled, MAAS will use passive techniques (such as listening to ARP requests and mDNS advertisements) to observe networks attached to rack controllers. Active subnet mapping will also be available to be enabled on the configured subnets."
      />
      <FormikField
        formikProps={formikProps}
        component={Select}
        options={discoveryIntervalOptions}
        fieldKey="active_discovery_interval"
        label="Active subnet mapping interval"
        help="When enabled, each rack will scan subnets enabled for active mapping. This helps ensure discovery information is accurate and complete."
      />
    </>
  );
};

NetworkDiscoveryFormFields.propTypes = extendFormikShape({
  active_discovery_interval: PropTypes.string,
  network_discovery: PropTypes.string
});

export default NetworkDiscoveryFormFields;
