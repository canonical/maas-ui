import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ConnectivityCard from "./ConnectivityCard";
import NameCard from "./NameCard";
import type { MaasIntroValues } from "./types";

import FormikForm from "app/base/components/FormikForm";
import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import introURLs from "app/intro/urls";
import authSelectors from "app/store/auth/selectors";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { actions as repoActions } from "app/store/packagerepository";
import repoSelectors from "app/store/packagerepository/selectors";

export const MaasIntroSchema = Yup.object()
  .shape({
    httpProxy: Yup.string().url("Must be a valid URL."),
    mainArchiveUrl: Yup.string()
      .url("Must be a valid URL.")
      .required("Ubuntu archive is required."),
    name: Yup.string().required("MAAS name is required"),
    portsArchiveUrl: Yup.string()
      .url("Must be a valid URL.")
      .required("Ubuntu extra architectures is required."),
    upstreamDns: Yup.string(),
  })
  .defined();

const MaasIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const authLoading = useSelector(authSelectors.loading);
  const httpProxy = useSelector(configSelectors.httpProxy);
  const maasName = useSelector(configSelectors.maasName);
  const upstreamDns = useSelector(configSelectors.upstreamDns);
  const configErrors = useSelector(configSelectors.errors);
  const configLoading = useSelector(configSelectors.loading);
  const configSaved = useSelector(configSelectors.saved);
  const configSaving = useSelector(configSelectors.saving);
  const reposErrors = useSelector(repoSelectors.errors);
  const reposLoading = useSelector(repoSelectors.loading);
  const reposSaving = useSelector(repoSelectors.saving);
  const mainArchive = useSelector(repoSelectors.mainArchive);
  const portsArchive = useSelector(repoSelectors.portsArchive);

  useWindowTitle("Welcome");

  useEffect(() => {
    dispatch(repoActions.fetch());
  }, [dispatch]);

  const errors = { ...configErrors, ...reposErrors };
  const loading = authLoading || configLoading || reposLoading;
  const saving = configSaving || reposSaving;
  const saved = configSaved;

  return (
    <Section>
      {loading ? (
        <Spinner text="Loading..." />
      ) : (
        <FormikForm<MaasIntroValues>
          allowUnchanged
          buttonsBordered={false}
          cleanup={configActions.cleanup}
          errors={errors}
          initialValues={{
            httpProxy: httpProxy || "",
            mainArchiveUrl: mainArchive?.url || "",
            name: maasName || "",
            portsArchiveUrl: portsArchive?.url || "",
            upstreamDns: upstreamDns || "",
          }}
          onSaveAnalytics={{
            action: "Saved",
            category: "Intro",
            label: "Intro form",
          }}
          onSubmit={(values) => {
            dispatch(configActions.cleanup());
            dispatch(repoActions.cleanup());
            dispatch(
              configActions.update({
                http_proxy: values.httpProxy,
                maas_name: values.name,
                upstream_dns: values.upstreamDns,
              })
            );
            if (mainArchive && mainArchive.url !== values.mainArchiveUrl) {
              dispatch(
                repoActions.update({
                  id: mainArchive.id,
                  name: mainArchive.name,
                  url: values.mainArchiveUrl,
                })
              );
            }
            if (portsArchive && portsArchive.url !== values.portsArchiveUrl) {
              dispatch(
                repoActions.update({
                  id: portsArchive.id,
                  name: portsArchive.name,
                  url: values.portsArchiveUrl,
                })
              );
            }
          }}
          saving={saving}
          saved={saved}
          savedRedirect={introURLs.images}
          submitLabel="Save and continue"
          validationSchema={MaasIntroSchema}
        >
          <NameCard />
          <ConnectivityCard />
        </FormikForm>
      )}
    </Section>
  );
};

export default MaasIntro;
