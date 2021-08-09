import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { NetworkDiscoveryValues } from "../types";

import FormikField from "app/base/components/FormikField";
import configSelectors from "app/store/config/selectors";
import { NetworkDiscovery } from "app/store/config/types";

const NetworkDiscoveryFormFields = (): JSX.Element => {
  const { values } = useFormikContext<NetworkDiscoveryValues>();
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
        options={
          // This won't need to pass the empty array once this issue is fixed:
          // https://github.com/canonical-web-and-design/react-components/issues/570
          networkDiscoveryOptions || []
        }
        name="network_discovery"
        label="Network discovery"
        help="When enabled, MAAS will use passive techniques (such as listening to ARP requests and mDNS advertisements) to observe networks attached to rack controllers. Active subnet mapping will also be available to be enabled on the configured subnets."
      />
      <FormikField
        component={Select}
        disabled={values.network_discovery === NetworkDiscovery.DISABLED}
        options={
          // This won't need to pass the empty array once this issue is fixed:
          // https://github.com/canonical-web-and-design/react-components/issues/570
          discoveryIntervalOptions || []
        }
        name="active_discovery_interval"
        label="Active subnet mapping interval"
        help="When enabled, each rack will scan subnets enabled for active mapping. This helps ensure discovery information is accurate and complete."
      />
    </>
  );
};

export default NetworkDiscoveryFormFields;
