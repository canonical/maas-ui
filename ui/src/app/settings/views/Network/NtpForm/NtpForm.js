import {
  ActionButton,
  Col,
  Form,
  Loader,
  Row
} from "@canonical/react-components";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useWindowTitle } from "app/base/hooks";
import NtpFormFields from "../NtpFormFields";

const NtpSchema = Yup.object().shape({
  ntp_external_only: Yup.boolean().required(),
  ntp_servers: Yup.string()
});

const NtpForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const ntpExternalOnly = useSelector(configSelectors.ntpExternalOnly);
  const ntpServers = useSelector(configSelectors.ntpServers);

  useWindowTitle("NTP");

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
