import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const ProxyFormFields = ({ formikProps }) => {
  const { values } = formikProps;

  return (
    <>
      <label>
        HTTP proxy used by MAAS to download images, and by provisioned machines
        for APT and YUM packages.
      </label>
      <FormikField
        formikProps={formikProps}
        fieldKey="proxyType"
        value="noProxy"
        label="Don't use a proxy"
        type="radio"
        checked={values.proxyType === "noProxy"}
      />
      <FormikField
        formikProps={formikProps}
        fieldKey="proxyType"
        value="builtInProxy"
        label="MAAS built-in"
        type="radio"
        checked={values.proxyType === "builtInProxy"}
      />
      <FormikField
        formikProps={formikProps}
        fieldKey="proxyType"
        value="externalProxy"
        label="External"
        type="radio"
        checked={values.proxyType === "externalProxy"}
      />
      {values.proxyType === "externalProxy" && (
        <FormikField
          formikProps={formikProps}
          fieldKey="httpProxy"
          help="Enter the external proxy URL MAAS will use to download images and machines to download APT packages."
          type="text"
          required={true}
        />
      )}
      <FormikField
        formikProps={formikProps}
        fieldKey="proxyType"
        value="peerProxy"
        label="Peer"
        type="radio"
        checked={values.proxyType === "peerProxy"}
      />
      {values.proxyType === "peerProxy" && (
        <FormikField
          formikProps={formikProps}
          fieldKey="httpProxy"
          help="Enter the external proxy URL that the MAAS built-in proxy will use as an upstream cache peer. Machines will be configured to use MAAS' built-in proxy to download APT packages."
          type="text"
          required={true}
        />
      )}
    </>
  );
};

ProxyFormFields.propTypes = extendFormikShape({
  httpProxy: PropTypes.string,
  proxyType: PropTypes.string
});

export default ProxyFormFields;
