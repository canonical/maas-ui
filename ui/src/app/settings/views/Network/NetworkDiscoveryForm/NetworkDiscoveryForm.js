import {
  ActionButton,
  Col,
  Form,
  Loader,
  Row
} from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useWindowTitle } from "app/base/hooks";
import NetworkDiscoveryFormFields from "../NetworkDiscoveryFormFields";

const NetworkDiscoverySchema = Yup.object().shape({
  active_discovery_interval: Yup.number().required(),
  network_discovery: Yup.string().required()
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
        {loading && <Loader text="Loading..." />}
        {loaded && (
          <Formik
            initialValues={{
              active_discovery_interval: activeDiscoveryInterval,
              network_discovery: networkDiscovery
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm(values);
            }}
            validationSchema={NetworkDiscoverySchema}
            render={formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                <NetworkDiscoveryFormFields formikProps={formikProps} />
                <ActionButton
                  appearance="positive"
                  className="u-no-margin--bottom"
                  type="submit"
                  disabled={formikFormDisabled(formikProps)}
                  loading={saving}
                  success={saved}
                >
                  Save
                </ActionButton>
              </Form>
            )}
          />
        )}
      </Col>
    </Row>
  );
};

export default NetworkDiscoveryForm;
