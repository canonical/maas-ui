import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import MaasIntroFields from "./MaasIntroFields";
import type { MaasIntroValues } from "./types";

import FormikForm from "app/base/components/FormikForm";
import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import baseURLs from "app/base/urls";
import machineURLs from "app/machines/urls";
import authSelectors from "app/store/auth/selectors";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

export const IntroSchema = Yup.object()
  .shape({
    name: Yup.string().required("MAAS name is required"),
  })
  .defined();

const MaasIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const authLoading = useSelector(authSelectors.loading);
  const authUser = useSelector(authSelectors.get);
  const errors = useSelector(configSelectors.errors);
  const maasName = useSelector(configSelectors.maasName);
  const configLoading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  useWindowTitle("Welcome");

  if (authLoading || configLoading) {
    return <Spinner />;
  }

  return (
    <Section>
      <FormikForm<MaasIntroValues>
        buttonsBordered={false}
        cleanup={configActions.cleanup}
        errors={errors}
        initialValues={{
          name: maasName || "",
        }}
        onSaveAnalytics={{
          action: "Saved",
          category: "Intro",
          label: "Intro form",
        }}
        onSuccess={() => {
          dispatch(configActions.fetch());
        }}
        onSubmit={(values) => {
          dispatch(configActions.cleanup());
          dispatch(
            configActions.update({
              completed_intro: true,
              maas_name: values.name,
            })
          );
        }}
        savedRedirect={
          authUser?.completed_intro
            ? machineURLs.machines.index
            : baseURLs.intro.user
        }
        saving={saving}
        saved={saved}
        submitLabel="Continue"
        validationSchema={IntroSchema}
      >
        <MaasIntroFields />
      </FormikForm>
    </Section>
  );
};

export default MaasIntro;
