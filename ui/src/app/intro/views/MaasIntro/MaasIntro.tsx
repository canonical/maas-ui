import { useEffect, useState } from "react";

import { Card, Icon } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import ConnectivityCard from "./ConnectivityCard";
import NameCard from "./NameCard";
import type { MaasIntroValues } from "./types";

import FormikFormContent from "app/base/components/FormikFormContent";
import TableConfirm from "app/base/components/TableConfirm";
import IntroSection from "app/intro/components/IntroSection";
import { useExitURL } from "app/intro/hooks";
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
  const history = useHistory();
  const authLoading = useSelector(authSelectors.loading);
  const authUser = useSelector(authSelectors.get);
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
  const [showSkip, setShowSkip] = useState(false);
  const exitURL = useExitURL();

  useEffect(() => {
    dispatch(repoActions.fetch());
  }, [dispatch]);

  const errors = {
    ...(configErrors && typeof configErrors === "object" ? configErrors : {}),
    ...(reposErrors && typeof reposErrors === "object" ? reposErrors : {}),
  };
  const loading = authLoading || configLoading || reposLoading;
  const saving = configSaving || reposSaving;
  const saved = configSaved;

  return (
    <IntroSection loading={loading}>
      <>
        <Formik
          initialValues={{
            httpProxy: httpProxy || "",
            mainArchiveUrl: mainArchive?.url || "",
            name: maasName || "",
            portsArchiveUrl: portsArchive?.url || "",
            upstreamDns: upstreamDns || "",
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
          validationSchema={MaasIntroSchema}
        >
          <FormikFormContent<MaasIntroValues>
            allowUnchanged
            buttonsBordered={false}
            cleanup={configActions.cleanup}
            editable={!showSkip}
            errors={errors}
            onSaveAnalytics={{
              action: "Saved",
              category: "Intro",
              label: "Intro form",
            }}
            saving={saving}
            saved={saved}
            savedRedirect={introURLs.images}
            secondarySubmit={() => {
              setShowSkip(true);
            }}
            secondarySubmitLabel="Skip setup"
            submitLabel="Save and continue"
          >
            <NameCard />
            <ConnectivityCard />
          </FormikFormContent>
        </Formik>
        {showSkip && (
          <Card data-testid="skip-setup" highlighted>
            <TableConfirm
              confirmLabel={
                authUser?.completed_intro ? "Skip setup" : "Skip to user setup"
              }
              message={
                <>
                  <Icon className="is-inline" name="warning" />
                  Are you sure you want to skip the initial MAAS setup? You will
                  still be able to find all configuration options in the
                  Settings and Images tabs.
                </>
              }
              onClose={() => setShowSkip(false)}
              onConfirm={() => {
                dispatch(configActions.update({ completed_intro: true }));
                if (!authUser?.completed_intro) {
                  history.push({ pathname: introURLs.user });
                } else {
                  history.push({
                    pathname: exitURL,
                  });
                }
              }}
              sidebar={false}
            />
          </Card>
        )}
      </>
    </IntroSection>
  );
};

export default MaasIntro;
