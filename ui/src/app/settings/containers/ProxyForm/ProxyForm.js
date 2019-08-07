import { Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import selectors from "app/settings/selectors";
import ProxyFormFields from "app/settings/components/ProxyFormFields";

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
  const httpProxy = useSelector(selectors.config.httpProxy);
  const proxyType = useSelector(selectors.config.proxyType);

  return (
    <Formik
      initialValues={{
        httpProxy,
        proxyType
      }}
      onSubmit={(values, { setSubmitting }) => {
        const { httpProxy, proxyType } = values;
        const enable_http_proxy = proxyType !== "noProxy";
        const use_peer_proxy = proxyType === "peerProxy";
        let http_proxy = "";
        if (proxyType === "externalProxy" || proxyType === "peerProxy") {
          http_proxy = httpProxy;
        }

        // TODO: Create redux action to save form
        const payload = { enable_http_proxy, http_proxy, use_peer_proxy };
        setTimeout(() => {
          alert(JSON.stringify(payload, null, 2));
          setSubmitting(false);
        }, 400);
      }}
      validationSchema={ProxySchema}
      render={formikProps => <ProxyFormFields formikProps={formikProps} />}
    />
  );
};

export default ProxyForm;
