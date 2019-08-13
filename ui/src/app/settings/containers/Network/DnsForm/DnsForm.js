import { Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import { useSettingsSave } from "app/base/hooks";
import ActionButton from "app/base/components/ActionButton";
import Col from "app/base/components/Col";
import Form from "app/base/components/Form";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
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
  const updateConfig = actions.config.update;

  const loaded = useSelector(config.loaded);
  const loading = useSelector(config.loading);
  const dnssecValidation = useSelector(config.dnssecValidation);
  const dnsTrustedAcl = useSelector(config.dnsTrustedAcl);
  const upstreamDns = useSelector(config.upstreamDns);

  const saving = useSelector(config.saving);
  const [savingUI, setSavingUI] = useState(false);
  const [success, setSuccess] = useState(false);
  useSettingsSave(saving, setSavingUI, setSuccess);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && (
          <Formik
            initialValues={{
              dnssec_validation: dnssecValidation,
              dns_trusted_acl: dnsTrustedAcl,
              upstream_dns: upstreamDns
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
                  disabled={formikFormDisabled(formikProps, success)}
                  loading={savingUI}
                  success={success}
                  width="60px"
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
