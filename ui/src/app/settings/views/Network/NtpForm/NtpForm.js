import { Col, Spinner, Row } from "@canonical/react-components";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { useWindowTitle } from "app/base/hooks";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const NtpSchema = Yup.object().shape({
  ntp_external_only: Yup.boolean().required(),
  ntp_servers: Yup.string(),
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
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm
            initialValues={{
              ntp_external_only: ntpExternalOnly,
              ntp_servers: ntpServers,
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
            saving={saving}
            saved={saved}
            validationSchema={NtpSchema}
          >
            <FormikField
              name="ntp_servers"
              label="Addresses of NTP servers"
              help="NTP servers, specified as IP addresses or hostnames delimited by commas and/or spaces, to be used as time references for MAAS itself, the machines MAAS deploys, and devices that make use of MAAS's DHCP services."
              type="text"
            />
            <FormikField
              name="ntp_external_only"
              label="Use external NTP servers only"
              help="Configure all region controller hosts, rack controller hosts, and subsequently deployed machines to refer directly to the configured external NTP servers. Otherwise only region controller hosts will be configured to use those external NTP servers, rack contoller hosts will in turn refer to the regions' NTP servers, and deployed machines will refer to the racks' NTP servers."
              type="checkbox"
            />
          </FormikForm>
        )}
      </Col>
    </Row>
  );
};

export default NtpForm;
