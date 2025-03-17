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

const NtpSchema = Yup.object().shape({
  ntp_external_only: Yup.boolean().required(),
  ntp_servers: Yup.string(),
});

const NtpForm = (): React.ReactElement => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);

  const ntpExternalOnly = useSelector(configSelectors.ntpExternalOnly);
  const ntpServers = useSelector(configSelectors.ntpServers);

  useWindowTitle("NTP");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        NTP
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm
            cleanup={configActions.cleanup}
            errors={errors}
            initialValues={{
              ntp_external_only: ntpExternalOnly ?? false,
              ntp_servers: ntpServers ?? "",
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Network settings",
              label: "NTP form",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            saved={saved}
            saving={saving}
            validationSchema={NtpSchema}
          >
            <FormikField
              help="NTP servers, specified as IP addresses or hostnames delimited by commas and/or spaces, to be used as time references for MAAS itself, the machines MAAS deploys, and devices that make use of MAAS's DHCP services."
              label="Addresses of NTP servers"
              name="ntp_servers"
              type="text"
            />
            <FormikField
              help="Configure all region controller hosts, rack controller hosts, and subsequently deployed machines to refer directly to the configured external NTP servers. Otherwise only region controller hosts will be configured to use those external NTP servers, rack contoller hosts will in turn refer to the regions' NTP servers, and deployed machines will refer to the racks' NTP servers."
              label="Use external NTP servers only"
              name="ntp_external_only"
              type="checkbox"
            />
          </FormikForm>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default NtpForm;
