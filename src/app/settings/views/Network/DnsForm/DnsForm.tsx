import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useWindowTitle } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

const DnsSchema = Yup.object().shape({
  // TODO: Client-side IP validation, or display error from server
  // https://github.com/canonical/maas-ui/issues/39
  upstream_dns: Yup.string(),
  dnssec_validation: Yup.string().required(),
  dns_trusted_acl: Yup.string(),
});

const DnsForm = (): React.ReactElement => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);

  const dnssecValidation = useSelector(configSelectors.dnssecValidation);
  const dnsTrustedAcl = useSelector(configSelectors.dnsTrustedAcl);
  const upstreamDns = useSelector(configSelectors.upstreamDns);
  const dnssecOptions = useSelector(configSelectors.dnssecOptions);

  useWindowTitle("DNS");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        DNS
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm
            cleanup={configActions.cleanup}
            errors={errors}
            initialValues={{
              dnssec_validation: dnssecValidation || "",
              dns_trusted_acl: dnsTrustedAcl || "",
              upstream_dns: upstreamDns || "",
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Network settings",
              label: "DNS form",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            saved={saved}
            saving={saving}
            validationSchema={DnsSchema}
          >
            <FormikField
              help="Only used when MAAS is running its own DNS server. This value is used as the value of 'forwarders' in the DNS server config."
              label="Upstream DNS used to resolve domains not managed by this MAAS (space-separated IP addresses)"
              name="upstream_dns"
              type="text"
            />
            <FormikField
              component={Select}
              help="Only used when MAAS is running its own DNS server. This value is used as the value of 'dnssec_validation' in the DNS server config."
              label="Enable DNSSEC validation of upstream zones"
              name="dnssec_validation"
              options={dnssecOptions}
            />
            <FormikField
              help="MAAS keeps a list of networks that are allowed to use MAAS for DNS resolution. This option allows to add extra networks (not previously known) to the trusted ACL where this list of networks is kept. It also supports specifying IPs or ACL names."
              label="List of external networks (not previously known), that will be allowed to use MAAS for DNS resolution"
              name="dns_trusted_acl"
              type="text"
            />
          </FormikForm>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default DnsForm;
