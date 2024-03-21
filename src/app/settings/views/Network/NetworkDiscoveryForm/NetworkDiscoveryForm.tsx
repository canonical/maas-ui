import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import NetworkDiscoveryFormFields from "./NetworkDiscoveryFormFields";
import type { NetworkDiscoveryValues } from "./types";

import FormikForm from "@/app/base/components/FormikForm";
import { useWindowTitle } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { NetworkDiscovery } from "@/app/store/config/types";

const NetworkDiscoverySchema = Yup.object().shape({
  active_discovery_interval: Yup.number().required(),
  network_discovery: Yup.string().required(),
});

const NetworkDiscoveryForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);

  const activeDiscoveryInterval = useSelector(
    configSelectors.activeDiscoveryInterval
  );
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);

  useWindowTitle("Network discovery");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Network discovery
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm<NetworkDiscoveryValues>
            cleanup={configActions.cleanup}
            errors={errors}
            initialValues={{
              active_discovery_interval: activeDiscoveryInterval || "",
              network_discovery: networkDiscovery || "",
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Network settings",
              label: "Network discovery form",
            }}
            onSubmit={(values, { resetForm }) => {
              if (values.network_discovery === NetworkDiscovery.DISABLED) {
                // Don't update the interval when the discovery is being disabled.
                delete values.active_discovery_interval;
              }
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            saved={saved}
            saving={saving}
            validationSchema={NetworkDiscoverySchema}
          >
            <NetworkDiscoveryFormFields />
          </FormikForm>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default NetworkDiscoveryForm;
