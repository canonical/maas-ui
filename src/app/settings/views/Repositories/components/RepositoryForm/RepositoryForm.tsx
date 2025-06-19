import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import RepositoryFormFields from "../RepositoryFormFields";

import type { RepositoryFormValues } from "./types";

import {
  useCreatePackageRepository,
  useUpdatePackageRepository,
} from "@/app/api/query/packageRepositories";
import type {
  ComponentsToDisableEnum,
  CreatePackageRepositoryData,
  CreatePackageRepositoryError,
  KnownArchesEnum,
  KnownComponentsEnum,
  PackageRepositoryResponse,
  PocketsToDisableEnum,
  UpdatePackageRepositoryData,
  UpdatePackageRepositoryError,
} from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { generalActions } from "@/app/store/general";
import {
  componentsToDisable as componentsToDisableSelectors,
  knownArchitectures as knownArchitecturesSelectors,
  pocketsToDisable as pocketsToDisableSelectors,
} from "@/app/store/general/selectors";
import {
  getIsDefaultRepo,
  getRepoDisplayName,
} from "@/app/store/packagerepository/utils";
import { parseCommaSeparatedValues } from "@/app/utils";

type Props = {
  repository?: PackageRepositoryResponse | null;
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
  const componentsToDisableLoaded = useSelector(
    componentsToDisableSelectors.loaded
  );
  const knownArchitecturesLoaded = useSelector(
    knownArchitecturesSelectors.loaded
  );
  const pocketsToDisableLoaded = useSelector(pocketsToDisableSelectors.loaded);
  const allLoaded =
    componentsToDisableLoaded &&
    knownArchitecturesLoaded &&
    pocketsToDisableLoaded;

  const createRepo = useCreatePackageRepository();
  const updateRepo = useUpdatePackageRepository();

  // Fetch data if not all loaded.
  useEffect(() => {
    if (!allLoaded) {
      dispatch(generalActions.fetchComponentsToDisable());
      dispatch(generalActions.fetchKnownArchitectures());
      dispatch(generalActions.fetchPocketsToDisable());
    }
  }, [dispatch, allLoaded]);

  const typeString = type === "ppa" ? "PPA" : "repository";
  let initialValues: RepositoryFormValues;
  let title;
  if (repository) {
    title = `Edit ${typeString}`;
    initialValues = {
      arches: repository.arches as unknown as KnownArchesEnum[],
      components: repository.components.join(", "),
      default: getIsDefaultRepo(repository),
      disable_sources: repository.disable_sources,
      disabled_components:
        repository.disabled_components as unknown as ComponentsToDisableEnum[],
      disabled_pockets:
        repository.disabled_pockets as unknown as PocketsToDisableEnum[],
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
          <FormikForm<
            RepositoryFormValues,
            CreatePackageRepositoryError | UpdatePackageRepositoryError
          >
            aria-label={title}
            errors={createRepo.error ?? updateRepo.error}
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
              const params:
                | CreatePackageRepositoryData["body"]
                | UpdatePackageRepositoryData["body"] = {
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
                ) as unknown as KnownComponentsEnum[];
                params.distributions = parseCommaSeparatedValues(
                  values.distributions
                );
                params.enabled = values.enabled;
              }

              if (repository) {
                updateRepo.mutate({
                  path: { package_repository_id: repository.id },
                  body: { ...params },
                });
              } else {
                createRepo.mutate({
                  body: { ...params },
                });
              }
            }}
            onSuccess={() => setSidePanelContent(null)}
            saved={createRepo.isSuccess || updateRepo.isSuccess}
            saving={createRepo.isPending || updateRepo.isPending}
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
