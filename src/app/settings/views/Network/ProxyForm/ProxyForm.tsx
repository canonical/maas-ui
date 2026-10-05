import { ContentSection, Layout } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Entitlement } from "../../UserManagement/views/Groups/constants";
import ProxyFormFields from "../ProxyFormFields";

import type { ProxyFormValues } from "./types";

import { useConfigurations } from "@/app/api/query/configurations";
import type { PublicConfigName } from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle, useHasEntitlements } from "@/app/base/hooks";
import { UrlSchema } from "@/app/base/validation";
import { getConfigsFromResponse } from "@/app/settings/utils";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { ConfigNames } from "@/app/store/config/types";
import type { ConfigValues } from "@/app/store/config/types";

const ProxySchema = Yup.object().shape({
  proxyType: Yup.string().required(),
  httpProxy: Yup.string().when("proxyType", {
    is: (val: string) => val === "externalProxy" || val === "peerProxy",
    then: UrlSchema.required("Please enter the proxy URL."),
  }),
});

export const proxyConfigNames = [
  ConfigNames.HTTP_PROXY,
  ConfigNames.ENABLE_HTTP_PROXY,
  ConfigNames.USE_PEER_PROXY,
] as PublicConfigName[];

export const proxyConfigsOptions = {
  query: { name: proxyConfigNames },
};

type ProxyConfigs = {
  http_proxy?: string;
  enable_http_proxy?: boolean;
  use_peer_proxy?: boolean;
};

const getProxyType = ({
  http_proxy,
  enable_http_proxy,
  use_peer_proxy,
}: ProxyConfigs): ProxyFormValues["proxyType"] => {
  if (!enable_http_proxy) {
    return "noProxy";
  }
  if (!http_proxy) {
    return "builtInProxy";
  }
  return use_peer_proxy ? "peerProxy" : "externalProxy";
};

const ProxyForm = (): React.ReactElement => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);

  const { data, isPending, error, isSuccess } =
    useConfigurations(proxyConfigsOptions);
  const proxyConfigs = getConfigsFromResponse(
    data?.items ?? [],
    proxyConfigNames
  ) as ProxyConfigs;
  const httpProxy = proxyConfigs.http_proxy;
  const proxyType = getProxyType(proxyConfigs);
  const { allowed: canEdit } = useHasEntitlements([
    Entitlement.CAN_EDIT_CONFIGURATIONS,
  ]);

  useWindowTitle("Proxy");

  if (isPending) {
    return <Layout.Skeleton view="settings" />;
  }

  return (
    <PageContent>
      <ContentSection variant="narrow">
        <ContentSection.Title className="section-header__title">
          Proxy
        </ContentSection.Title>
        <ContentSection.Content>
          {error && (
            <Notification
              severity="negative"
              title="Error while fetching proxy configurations"
            >
              {error.message}
            </Notification>
          )}
          {isSuccess && (
            <FormikForm<ProxyFormValues>
              cleanup={configActions.cleanup}
              editable={canEdit}
              enableReinitialize
              errors={errors}
              initialValues={{
                httpProxy: httpProxy || "",
                proxyType,
              }}
              onSaveAnalytics={{
                action: "Saved",
                category: "Network settings",
                label: "Proxy form",
              }}
              onSubmit={(values, { resetForm }) => {
                const { httpProxy, proxyType } = values;

                let formattedValues: Record<string, ConfigValues>;
                switch (proxyType) {
                  case "builtInProxy":
                    formattedValues = {
                      http_proxy: "",
                      enable_http_proxy: true,
                      use_peer_proxy: false,
                    };
                    break;
                  case "externalProxy":
                    formattedValues = {
                      http_proxy: httpProxy,
                      enable_http_proxy: true,
                      use_peer_proxy: false,
                    };
                    break;
                  case "peerProxy":
                    formattedValues = {
                      http_proxy: httpProxy,
                      enable_http_proxy: true,
                      use_peer_proxy: true,
                    };
                    break;
                  case "noProxy":
                  default:
                    formattedValues = {
                      http_proxy: "",
                      enable_http_proxy: false,
                      use_peer_proxy: false,
                    };
                    break;
                }
                dispatch(updateConfig(formattedValues));
                resetForm({ values });
              }}
              saved={saved}
              saving={saving}
              validationSchema={ProxySchema}
            >
              <ProxyFormFields canEdit={canEdit} />
            </FormikForm>
          )}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default ProxyForm;
