import PropTypes from "prop-types";
import React from "react";

import Button from "app/base/components/Button";
import Form from "app/base/components/Form";
import FormikField from "app/base/components/FormikField";

const ProxyFormFields = ({ formikProps }) => {
  const { handleSubmit, isSubmitting, values } = formikProps;

  return (
    <Form onSubmit={handleSubmit}>
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
      <div className="user-form__buttons">
        <Button
          appearance="positive"
          className="u-no-margin--bottom"
          type="submit"
          disabled={isSubmitting}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

ProxyFormFields.propTypes = {
  formikProps: PropTypes.shape({
    errors: PropTypes.shape({
      httpProxy: PropTypes.string,
      proxyType: PropTypes.string
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    touched: PropTypes.shape({
      httpProxy: PropTypes.bool,
      proxyType: PropTypes.bool
    }).isRequired,
    values: PropTypes.shape({
      httpProxy: PropTypes.string,
      proxyType: PropTypes.string
    }).isRequired
  })
};

export default ProxyFormFields;
