import { useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import RepositoryFormFields from "../RepositoryFormFields";

import type { RepositoryFormValues } from "./types";

import FormikForm from "@/app/base/components/FormikForm";
import { useAddMessage } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import settingsURLs from "@/app/settings/urls";
import { generalActions } from "@/app/store/general";
import {
  componentsToDisable as componentsToDisableSelectors,
  knownArchitectures as knownArchitecturesSelectors,
  pocketsToDisable as pocketsToDisableSelectors,
} from "@/app/store/general/selectors";
import { repositoryActions } from "@/app/store/packagerepository";
import repositorySelectors from "@/app/store/packagerepository/selectors";
import type {
  CreateParams,
  PackageRepository,
} from "@/app/store/packagerepository/types";
import { getRepoDisplayName } from "@/app/store/packagerepository/utils";
import { parseCommaSeparatedValues } from "@/app/utils";

type Props = {
  repository?: PackageRepository | null;
  type: "ppa" | "repository";
};

const commaSeparated = Yup.string()
  .transform((value) =>
    value
      .split(",")
      .map((s: string) => s.trim())
      .join(", ")
  )
  .matches(/^(?:[^,\s]+(?:,\s*[^,\s]+)*)?$/, "Must be comma-separated.");

const RepositorySchema = Yup.object().shape({
  arches: Yup.array(),
  components: commaSeparated,
  default: Yup.boolean().required(),
  disable_sources: Yup.boolean().required(),
  disabled_components: Yup.array(),
  disabled_pockets: Yup.array(),
  distributions: commaSeparated,
  enabled: Yup.boolean().required(),
  key: Yup.string(),
  name: Yup.string().required("Name field required."),
  url: Yup.string().required("URL field required."),
});

export const RepositoryForm = ({
  type,
  repository,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const { setSidePanelContent } = useSidePanel();
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
    () => {
      setSavedRepo(null);
    }
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
      name: getRepoDisplayName(repository.name),
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

  return (
    <>
      {!allLoaded ? (
        <Spinner text="Loading..." />
      ) : (
        <>
          <FormikForm<RepositoryFormValues>
            aria-label={title}
            cleanup={repositoryActions.cleanup}
            errors={errors}
            initialValues={initialValues}
            onCancel={() => {
              setSidePanelContent(null);
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Package repos settings",
              label: `${title} form`,
            }}
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
                params.components = parseCommaSeparatedValues(
                  values.components
                );
                params.distributions = parseCommaSeparatedValues(
                  values.distributions
                );
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
            saved={repositoriesSaved}
            savedRedirect={settingsURLs.repositories.index}
            saving={repositoriesSaving}
            submitLabel={`Save ${typeString}`}
            validationSchema={RepositorySchema}
          >
            <RepositoryFormFields type={type} />
          </FormikForm>
        </>
      )}
    </>
  );
};

export default RepositoryForm;
