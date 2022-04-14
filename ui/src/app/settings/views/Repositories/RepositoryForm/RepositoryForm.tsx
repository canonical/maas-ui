import { useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import RepositoryFormFields from "../RepositoryFormFields";

import type { RepositoryFormValues } from "./types";

import FormCard from "app/base/components/FormCard";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import settingsURLs from "app/settings/urls";
import { actions as generalActions } from "app/store/general";
import {
  componentsToDisable as componentsToDisableSelectors,
  knownArchitectures as knownArchitecturesSelectors,
  pocketsToDisable as pocketsToDisableSelectors,
} from "app/store/general/selectors";
import { actions as repositoryActions } from "app/store/packagerepository";
import repositorySelectors from "app/store/packagerepository/selectors";
import type {
  CreateParams,
  PackageRepository,
} from "app/store/packagerepository/types";
import { getRepoDisplayName } from "app/store/packagerepository/utils";

type Props = {
  repository?: PackageRepository | null;
  type: "ppa" | "repository";
};

const RepositorySchema = Yup.object().shape({
  arches: Yup.array(),
  components: Yup.string(),
  default: Yup.boolean().required(),
  disable_sources: Yup.boolean().required(),
  disabled_components: Yup.array(),
  disabled_pockets: Yup.array(),
  distributions: Yup.string(),
  enabled: Yup.boolean().required(),
  key: Yup.string(),
  name: Yup.string().required("Name field required."),
  url: Yup.string().required("URL field required."),
});

export const RepositoryForm = ({ type, repository }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [savedRepo, setSavedRepo] = useState<string | null>(null);
  const componentsToDisableLoaded = useSelector(
    componentsToDisableSelectors.loaded
  );
  const knownArchitecturesLoaded = useSelector(
    knownArchitecturesSelectors.loaded
  );
  const pocketsToDisableLoaded = useSelector(pocketsToDisableSelectors.loaded);
  const repositoriesLoaded = useSelector(repositorySelectors.loaded);
  const repositoriesSaved = useSelector(repositorySelectors.saved);
  const repositoriesSaving = useSelector(repositorySelectors.saving);
  const errors = useSelector(repositorySelectors.errors);
  const allLoaded =
    componentsToDisableLoaded &&
    knownArchitecturesLoaded &&
    pocketsToDisableLoaded &&
    repositoriesLoaded;

  useAddMessage(
    repositoriesSaved,
    repositoryActions.cleanup,
    `${savedRepo} ${repository ? "updated" : "added"} successfully.`,
    () => setSavedRepo(null)
  );

  // Fetch data if not all loaded.
  useEffect(() => {
    if (!allLoaded) {
      dispatch(generalActions.fetchComponentsToDisable());
      dispatch(generalActions.fetchKnownArchitectures());
      dispatch(generalActions.fetchPocketsToDisable());
      dispatch(repositoryActions.fetch());
    }
  }, [dispatch, allLoaded]);

  const typeString = type === "ppa" ? "PPA" : "repository";
  let initialValues;
  let title;
  if (repository) {
    title = `Edit ${typeString}`;
    initialValues = {
      arches: repository.arches,
      components: repository.components.join(", "),
      default: repository.default,
      disable_sources: repository.disable_sources,
      disabled_components: repository.disabled_components,
      disabled_pockets: repository.disabled_pockets,
      distributions: repository.distributions.join(", "),
      enabled: repository.enabled,
      key: repository.key,
      name: getRepoDisplayName(repository),
      url: repository.url,
    };
  } else {
    title = `Add ${typeString}`;
    initialValues = {
      arches: ["i386", "amd64"],
      components: "",
      default: false,
      disable_sources: false,
      disabled_components: [],
      disabled_pockets: [],
      distributions: "",
      enabled: true,
      key: "",
      name: "",
      url: type === "ppa" ? "ppa:" : "",
    };
  }

  useWindowTitle(title);

  return (
    <>
      {!allLoaded ? (
        <Spinner text="Loading..." />
      ) : (
        <FormCard title={title}>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              const params: CreateParams = {
                arches: values.arches,
                disable_sources: values.disable_sources,
                key: values.key,
                name: values.name,
                url: values.url,
              };

              if (values.default) {
                params.disabled_components = values.disabled_components;
                params.disabled_pockets = values.disabled_pockets;
              } else {
                params.components = values.components
                  .split(" ,")
                  .filter(Boolean);
                params.distributions = values.distributions
                  .split(" ,")
                  .filter(Boolean);
                params.enabled = values.enabled;
              }

              dispatch(repositoryActions.cleanup());
              if (repository) {
                dispatch(
                  repositoryActions.update({
                    ...params,
                    id: repository.id,
                  })
                );
              } else {
                dispatch(repositoryActions.create(params));
              }
              setSavedRepo(values.name);
            }}
            validationSchema={RepositorySchema}
          >
            <FormikFormContent<RepositoryFormValues>
              cleanup={repositoryActions.cleanup}
              errors={errors}
              onCancel={() =>
                history.push({ pathname: settingsURLs.repositories.index })
              }
              onSaveAnalytics={{
                action: "Saved",
                category: "Package repos settings",
                label: `${title} form`,
              }}
              saving={repositoriesSaving}
              saved={repositoriesSaved}
              savedRedirect={settingsURLs.repositories.index}
              submitLabel={`Save ${typeString}`}
            >
              <RepositoryFormFields type={type} />
            </FormikFormContent>
          </Formik>
        </FormCard>
      )}
    </>
  );
};

export default RepositoryForm;
