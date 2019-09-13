import { Formik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  general as generalActions,
  packagerepository as repositoryActions
} from "app/base/actions";
import {
  general as generalSelectors,
  packagerepository as repositorySelectors
} from "app/base/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { getRepoDisplayName } from "../utils";
import { useAddMessage } from "app/base/hooks";
import Form from "app/base/components/Form";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import Loader from "app/base/components/Loader";
import RepositoryFormFields from "../RepositoryFormFields";
import { RepositoryShape } from "app/settings/proptypes";

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
  url: Yup.string().required("URL field required.")
});

export const RepositoryForm = ({ type, repository }) => {
  const [savedRepo, setSavedRepo] = useState();

  const componentsToDisableLoaded = useSelector(
    generalSelectors.componentsToDisable.loaded
  );
  const knownArchitecturesLoaded = useSelector(
    generalSelectors.knownArchitectures.loaded
  );
  const pocketsToDisableLoaded = useSelector(
    generalSelectors.pocketsToDisable.loaded
  );
  const repositoriesLoaded = useSelector(repositorySelectors.loaded);
  const repositoriesSaved = useSelector(repositorySelectors.saved);
  const repositoriesSaving = useSelector(repositorySelectors.saving);
  const allLoaded =
    componentsToDisableLoaded &&
    knownArchitecturesLoaded &&
    pocketsToDisableLoaded &&
    repositoriesLoaded;

  const dispatch = useDispatch();
  useAddMessage(
    repositoriesSaved,
    repositoryActions.cleanup,
    `${savedRepo} ${repository ? "updated" : "added"} successfully.`,
    setSavedRepo
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

  // Clean up saved and error states on unmount.
  useEffect(() => {
    dispatch(repositoryActions.cleanup());
  }, [dispatch]);

  if (repositoriesSaved) {
    // The repo was successfully created/updated so redirect to the repo list.
    return <Redirect to="/repositories" />;
  }

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
      url: repository.url
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
      url: type === "ppa" ? "ppa:" : ""
    };
  }

  return (
    <>
      {!allLoaded ? (
        <Loader text="Loading..." />
      ) : (
        <FormCard title={title}>
          <Formik
            initialValues={initialValues}
            validationSchema={RepositorySchema}
            onSubmit={values => {
              const params = {
                arches: values.arches,
                default: values.default,
                disable_sources: values.disable_sources,
                key: values.key
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
                params.name = values.name;
                params.url = values.url;
              }

              dispatch(repositoryActions.cleanup());
              if (repository) {
                params.id = repository.id;
                dispatch(repositoryActions.update(params));
              } else {
                dispatch(repositoryActions.create(params));
              }
              setSavedRepo(values.name);
            }}
            render={formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                <RepositoryFormFields formikProps={formikProps} type={type} />
                <FormCardButtons
                  actionDisabled={
                    repositoriesSaving || formikFormDisabled(formikProps)
                  }
                  actionLabel={`Save ${typeString}`}
                  actionLoading={repositoriesSaving}
                  actionSuccess={repositoriesSaved}
                />
              </Form>
            )}
          ></Formik>
        </FormCard>
      )}
    </>
  );
};

RepositoryForm.propTypes = {
  type: PropTypes.oneOf(["ppa", "repository"]).isRequired,
  repository: RepositoryShape
};

export default RepositoryForm;
