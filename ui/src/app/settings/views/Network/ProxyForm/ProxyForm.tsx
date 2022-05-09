import { useEffect } from "react";

import { Col, Spinner, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ProxyFormFields from "../ProxyFormFields";

import type { ProxyFormValues } from "./types";

import FormikForm from "app/base/components/FormikForm";
import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const ProxySchema = Yup.object().shape({
  httpProxy: Yup.string().when("proxyType", {
    is: (val: string) => val === "externalProxy" || val === "peerProxy",
    then: Yup.string()
      .url("Must be a valid URL.")
      .required("Please enter the proxy URL."),
  }),
  proxyType: Yup.string().required(),
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
          <FormikForm<ProxyFormValues>
            buttonsAlign="left"
            buttonsBordered={false}
            initialValues={{
              httpProxy: httpProxy || "",
              proxyType,
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Network settings",
              label: "Proxy form",
            }}
            onSubmit={(values, { resetForm }) => {
              const { httpProxy, proxyType } = values;

              let formattedValues = {};
              switch (proxyType) {
                case "builtInProxy":
                  formattedValues = {
                    enable_http_proxy: true,
                    http_proxy: "",
                    use_peer_proxy: false,
                  };
                  break;
                case "externalProxy":
                  formattedValues = {
                    enable_http_proxy: true,
                    http_proxy: httpProxy,
                    use_peer_proxy: false,
                  };
                  break;
                case "peerProxy":
                  formattedValues = {
                    enable_http_proxy: true,
                    http_proxy: httpProxy,
                    use_peer_proxy: true,
                  };
                  break;
                case "noProxy":
                default:
                  formattedValues = {
                    enable_http_proxy: false,
                    http_proxy: "",
                    use_peer_proxy: false,
                  };
                  break;
              }
              dispatch(updateConfig(formattedValues));
              resetForm({ values });
            }}
            saving={saving}
            saved={saved}
            validationSchema={ProxySchema}
          >
            <ProxyFormFields />
          </FormikForm>
        )}
      </Col>
    </Row>
  );
};

export default ProxyForm;
