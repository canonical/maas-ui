import { Formik } from "formik";
import React, { useEffect } from "react";
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
  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  const ntpExternalOnly = useSelector(config.ntpExternalOnly);
  const ntpServers = useSelector(config.ntpServers);

  useEffect(() => {
    if (!loaded) {
      dispatch(actions.config.fetch());
    }
  }, [dispatch, loaded]);

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

export default NtpForm;
