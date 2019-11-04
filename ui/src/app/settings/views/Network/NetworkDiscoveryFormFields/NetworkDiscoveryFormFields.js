import { Select } from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import { config as configSelectors } from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";

const NetworkDiscoveryFormFields = ({ formikProps }) => {
  const networkDiscoveryOptions = useSelector(
    configSelectors.networkDiscoveryOptions
  );
  const discoveryIntervalOptions = useSelector(
    configSelectors.discoveryIntervalOptions
  );

  return (
    <>
      <FormikField
        component={Select}
        options={networkDiscoveryOptions}
        name="network_discovery"
        label="Network discovery"
        help="When enabled, MAAS will use passive techniques (such as listening to ARP requests and mDNS advertisements) to observe networks attached to rack controllers. Active subnet mapping will also be available to be enabled on the configured subnets."
      />
      <FormikField
        component={Select}
        options={discoveryIntervalOptions}
        name="active_discovery_interval"
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
