import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useWindowTitle } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

const SyslogSchema = Yup.object().shape({
  remote_syslog: Yup.string(),
});

const SyslogForm = (): React.ReactElement => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);

  const remoteSyslog = useSelector(configSelectors.remoteSyslog);

  useWindowTitle("Syslog");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Syslog
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm
            cleanup={configActions.cleanup}
            errors={errors}
            initialValues={{
              remote_syslog: remoteSyslog || "",
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Network settings",
              label: "Syslog form",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            saved={saved}
            saving={saving}
            validationSchema={SyslogSchema}
          >
            <FormikField
              help="A remote syslog server that MAAS will set on enlisting, commissioning, testing, and deploying machines to send all log messages. Clearing this value will restore the default behaviour of forwarding syslog to MAAS."
              label="Remote syslog server to forward machine logs"
              name="remote_syslog"
              type="text"
            />
          </FormikForm>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default SyslogForm;
