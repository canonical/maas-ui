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
import NtpFormFields from "../NtpFormFields";

const NtpSchema = Yup.object().shape({
  ntp_external_only: Yup.boolean().required(),
  ntp_servers: Yup.string()
});

const NtpForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const loaded = useSelector(config.loaded);
  const loading = useSelector(config.loading);
  const ntpExternalOnly = useSelector(config.ntpExternalOnly);
  const ntpServers = useSelector(config.ntpServers);

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
              ntp_external_only: ntpExternalOnly,
              ntp_servers: ntpServers
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm(values);
            }}
            validationSchema={NtpSchema}
            render={formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                <NtpFormFields formikProps={formikProps} />
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

export default NtpForm;
