import { Col, Loader, Row } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { useWindowTitle } from "app/base/hooks";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const SyslogSchema = Yup.object().shape({
  remote_syslog: Yup.string()
});

const SyslogForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const remoteSyslog = useSelector(configSelectors.remoteSyslog);

  useWindowTitle("Syslog");

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
          <FormikForm
            initialValues={{
              remote_syslog: remoteSyslog || ""
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Network settings",
              label: "Syslog form"
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            saving={saving}
            saved={saved}
            validationSchema={SyslogSchema}
          >
            <FormikField
              name="remote_syslog"
              label="Remote syslog server to forward machine logs"
              help="A remote syslog server that MAAS will set on enlisting, commissioning, testing, and deploying machines to send all log messages. Clearing this value will restore the default behaviour of forwarding syslog to MAAS."
              type="text"
            />
          </FormikForm>
        )}
      </Col>
    </Row>
  );
};

export default SyslogForm;
