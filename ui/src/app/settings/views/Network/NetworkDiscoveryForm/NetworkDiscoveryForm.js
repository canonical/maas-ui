import { Col, Spinner, Row, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as Yup from "yup";

import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { useWindowTitle } from "app/base/hooks";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const NetworkDiscoverySchema = Yup.object().shape({
  active_discovery_interval: Yup.number().required(),
  network_discovery: Yup.string().required(),
});

const NetworkDiscoveryForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const activeDiscoveryInterval = useSelector(
    configSelectors.activeDiscoveryInterval
  );
  const networkDiscoveryOptions = useSelector(
    configSelectors.networkDiscoveryOptions
  );
  const discoveryIntervalOptions = useSelector(
    configSelectors.discoveryIntervalOptions
  );
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);

  useWindowTitle("Network discovery");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm
            initialValues={{
              active_discovery_interval: activeDiscoveryInterval,
              network_discovery: networkDiscovery,
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Network settings",
              label: "Network discovery form",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            saving={saving}
            saved={saved}
            validationSchema={NetworkDiscoverySchema}
          >
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
          </FormikForm>
        )}
      </Col>
    </Row>
  );
};

export default NetworkDiscoveryForm;
