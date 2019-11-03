import { Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useWindowTitle } from "app/base/hooks";
import { ActionButton } from "@canonical/react-components";
import { Col } from "@canonical/react-components";
import { Form } from "@canonical/react-components";
import { Loader } from "@canonical/react-components";
import { Row } from "@canonical/react-components";
import DnsFormFields from "../DnsFormFields";

const DnsSchema = Yup.object().shape({
  // TODO: Client-side IP validation, or display error from server
  // https://github.com/canonical-web-and-design/maas-ui/issues/39
  upstream_dns: Yup.string(),
  dnssec_validation: Yup.string().required(),
  dns_trusted_acl: Yup.string()
});

const DnsForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const dnssecValidation = useSelector(configSelectors.dnssecValidation);
  const dnsTrustedAcl = useSelector(configSelectors.dnsTrustedAcl);
  const upstreamDns = useSelector(configSelectors.upstreamDns);

  useWindowTitle("DNS");

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
              dnssec_validation: dnssecValidation || "",
              dns_trusted_acl: dnsTrustedAcl || "",
              upstream_dns: upstreamDns || ""
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm(values);
            }}
            validationSchema={DnsSchema}
            render={formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                <DnsFormFields formikProps={formikProps} />
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

export default DnsForm;
