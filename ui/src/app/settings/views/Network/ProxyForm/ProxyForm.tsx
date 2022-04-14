import { useEffect } from "react";

import { Col, Spinner, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ProxyFormFields from "../ProxyFormFields";

import type { ProxyFormValues } from "./types";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const ProxySchema = Yup.object().shape({
  proxyType: Yup.string().required(),
  httpProxy: Yup.string().when("proxyType", {
    is: (val: string) => val === "externalProxy" || val === "peerProxy",
    then: Yup.string()
      .url("Must be a valid URL.")
      .required("Please enter the proxy URL."),
  }),
});

const ProxyForm = (): JSX.Element => {
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
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <Formik
            initialValues={{
              httpProxy: httpProxy || "",
              proxyType,
            }}
            onSubmit={(values, { resetForm }) => {
              const { httpProxy, proxyType } = values;

              let formattedValues = {};
              switch (proxyType) {
                case "builtInProxy":
                  formattedValues = {
                    http_proxy: "",
                    enable_http_proxy: true,
                    use_peer_proxy: false,
                  };
                  break;
                case "externalProxy":
                  formattedValues = {
                    http_proxy: httpProxy,
                    enable_http_proxy: true,
                    use_peer_proxy: false,
                  };
                  break;
                case "peerProxy":
                  formattedValues = {
                    http_proxy: httpProxy,
                    enable_http_proxy: true,
                    use_peer_proxy: true,
                  };
                  break;
                case "noProxy":
                default:
                  formattedValues = {
                    http_proxy: "",
                    enable_http_proxy: false,
                    use_peer_proxy: false,
                  };
                  break;
              }
              dispatch(updateConfig(formattedValues));
              resetForm({ values });
            }}
            validationSchema={ProxySchema}
          >
            <FormikFormContent<ProxyFormValues>
              buttonsAlign="left"
              buttonsBordered={false}
              onSaveAnalytics={{
                action: "Saved",
                category: "Network settings",
                label: "Proxy form",
              }}
              saving={saving}
              saved={saved}
            >
              <ProxyFormFields />
            </FormikFormContent>
          </Formik>
        )}
      </Col>
    </Row>
  );
};

export default ProxyForm;
