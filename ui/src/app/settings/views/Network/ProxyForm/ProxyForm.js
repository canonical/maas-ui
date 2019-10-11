import { Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useWindowTitle } from "app/base/hooks";
import ActionButton from "app/base/components/ActionButton";
import Col from "app/base/components/Col";
import Form from "app/base/components/Form";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import ProxyFormFields from "../ProxyFormFields";

const ProxySchema = Yup.object().shape({
  proxyType: Yup.string().required(),
  httpProxy: Yup.string().when("proxyType", {
    is: val => val === "externalProxy" || val === "peerProxy",
    then: Yup.string()
      .url("Must be a valid URL.")
      .required("Please enter the proxy URL.")
  })
});

const ProxyForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const httpProxy = useSelector(configSelectors.httpProxy);
  const proxyType = useSelector(configSelectors.proxyType);

  useWindowTitle("Proxy");

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
              httpProxy: httpProxy || "",
              proxyType
            }}
            onSubmit={(values, { resetForm }) => {
              const { httpProxy, proxyType } = values;

              let formattedValues = {};
              switch (proxyType) {
                case "builtInProxy":
                  formattedValues = {
                    http_proxy: "",
                    enable_http_proxy: true,
                    use_peer_proxy: false
                  };
                  break;
                case "externalProxy":
                  formattedValues = {
                    http_proxy: httpProxy,
                    enable_http_proxy: true,
                    use_peer_proxy: false
                  };
                  break;
                case "peerProxy":
                  formattedValues = {
                    http_proxy: httpProxy,
                    enable_http_proxy: true,
                    use_peer_proxy: true
                  };
                  break;
                case "noProxy":
                default:
                  formattedValues = {
                    http_proxy: "",
                    enable_http_proxy: false,
                    use_peer_proxy: false
                  };
                  break;
              }

              dispatch(updateConfig(formattedValues));
              resetForm(values);
            }}
            validationSchema={ProxySchema}
            render={formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                <ProxyFormFields formikProps={formikProps} />
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

export default ProxyForm;
