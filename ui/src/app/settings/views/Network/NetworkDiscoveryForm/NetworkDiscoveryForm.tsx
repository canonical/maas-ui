import { useEffect } from "react";

import { Col, Spinner, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import NetworkDiscoveryFormFields from "./NetworkDiscoveryFormFields";
import type { NetworkDiscoveryValues } from "./types";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { NetworkDiscovery } from "app/store/config/types";

const NetworkDiscoverySchema = Yup.object().shape({
  active_discovery_interval: Yup.number().required(),
  network_discovery: Yup.string().required(),
});

const NetworkDiscoveryForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const activeDiscoveryInterval = useSelector(
    configSelectors.activeDiscoveryInterval
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
          <Formik<NetworkDiscoveryValues>
            initialValues={{
              active_discovery_interval: activeDiscoveryInterval || "",
              network_discovery: networkDiscovery || "",
            }}
            onSubmit={(values, { resetForm }) => {
              if (values.network_discovery === NetworkDiscovery.DISABLED) {
                // Don't update the interval when the discovery is being disabled.
                delete values.active_discovery_interval;
              }
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            validationSchema={NetworkDiscoverySchema}
          >
            <FormikFormContent<NetworkDiscoveryValues>
              buttonsAlign="left"
              buttonsBordered={false}
              onSaveAnalytics={{
                action: "Saved",
                category: "Network settings",
                label: "Network discovery form",
              }}
              saving={saving}
              saved={saved}
            >
              <NetworkDiscoveryFormFields />
            </FormikFormContent>
          </Formik>
        )}
      </Col>
    </Row>
  );
};

export default NetworkDiscoveryForm;
