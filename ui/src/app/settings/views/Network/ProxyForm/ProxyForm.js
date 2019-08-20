import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
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
  const updateConfig = actions.config.update;

  const loaded = useSelector(config.loaded);
  const loading = useSelector(config.loading);
  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  const httpProxy = useSelector(config.httpProxy);
  const proxyType = useSelector(config.proxyType);

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
