import { useEffect } from "react";

import { Col, Spinner, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const SyslogSchema = Yup.object().shape({
  remote_syslog: Yup.string(),
});

const SyslogForm = (): JSX.Element => {
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
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <Formik
            initialValues={{
              remote_syslog: remoteSyslog || "",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            validationSchema={SyslogSchema}
          >
            <FormikFormContent
              buttonsAlign="left"
              buttonsBordered={false}
              onSaveAnalytics={{
                action: "Saved",
                category: "Network settings",
                label: "Syslog form",
              }}
              saving={saving}
              saved={saved}
            >
              <FormikField
                name="remote_syslog"
                label="Remote syslog server to forward machine logs"
                help="A remote syslog server that MAAS will set on enlisting, commissioning, testing, and deploying machines to send all log messages. Clearing this value will restore the default behaviour of forwarding syslog to MAAS."
                type="text"
              />
            </FormikFormContent>
          </Formik>
        )}
      </Col>
    </Row>
  );
};

export default SyslogForm;
