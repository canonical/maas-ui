import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import Fields from "./IpmiFormFields";

import FormikForm from "@/app/base/components/FormikForm";
import { useWindowTitle } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { AutoIpmiPrivilegeLevel } from "@/app/store/config/types";

const IpmiSchema = Yup.object().shape({
  maas_auto_ipmi_user: Yup.string()
    .required(
      'The username cannot be left blank. The username is "maas" by default.'
    )
    .min(3, "The username must be 3 characters or more")
    .max(16, "The username must be 16 characters or less.")
    .matches(/^\S*$/, "The username may not contain spaces"),
  maas_auto_ipmi_k_g_bmc_key: Yup.string(),
  maas_auto_ipmi_user_privilege_level: Yup.string().matches(
    /(ADMIN|OPERATOR|USER)/
  ),
});

export enum Labels {
  FormLabel = "IPMI Form",
  Loading = "Loading...",
}

export type IpmiFormValues = {
  maas_auto_ipmi_user: string;
  maas_auto_ipmi_k_g_bmc_key: string;
  maas_auto_ipmi_user_privilege_level: AutoIpmiPrivilegeLevel;
};

const IpmiSettings = (): React.ReactElement => {
  const dispatch = useDispatch();
  const configLoaded = useSelector(configSelectors.loaded);
  const configLoading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);
  const ipmiUser = useSelector(configSelectors.maasAutoIpmiUser);
  const bmcKey = useSelector(configSelectors.maasAutoIpmiKGBmcKey);
  const ipmiPrivilegeLevel = useSelector(
    configSelectors.maasAutoUserPrivilegeLevel
  );
  useWindowTitle("IPMI settings");

  useEffect(() => {
    if (!configLoaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, configLoaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        IPMI settings
      </ContentSection.Title>
      <ContentSection.Content>
        {configLoading && <Spinner text={Labels.Loading} />}
        {configLoaded && (
          <FormikForm<IpmiFormValues>
            aria-label={Labels.FormLabel}
            cleanup={configActions.cleanup}
            errors={errors}
            initialValues={{
              maas_auto_ipmi_user: ipmiUser || "maas",
              maas_auto_ipmi_k_g_bmc_key: bmcKey || "",
              maas_auto_ipmi_user_privilege_level:
                ipmiPrivilegeLevel || AutoIpmiPrivilegeLevel.ADMIN,
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Configuration settings",
              label: "IPMI form",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(configActions.update(values));
              resetForm({ values });
            }}
            saved={saved}
            saving={saving}
            validationSchema={IpmiSchema}
          >
            <Fields />
          </FormikForm>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default IpmiSettings;
