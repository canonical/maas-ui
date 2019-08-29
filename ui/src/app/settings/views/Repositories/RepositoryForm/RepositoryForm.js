import { Formik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import "./RepositoryForm.scss";
import actions from "app/settings/actions";
import { formikFormDisabled } from "app/settings/utils";
import { getRepoDisplayName } from "../utils";
import { messages } from "app/base/actions";
import selectors from "app/settings/selectors";
import { useRouter } from "app/base/hooks";
import ActionButton from "app/base/components/ActionButton";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Form from "app/base/components/Form";
import Loader from "app/base/components/Loader";
import RepositoryFormFields from "../RepositoryFormFields";
import { RepositoryShape } from "app/settings/proptypes";
import Row from "app/base/components/Row";

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
  const { history } = useRouter();

  const componentsToDisableLoaded = useSelector(
    selectors.general.componentsToDisable.loaded
  );
  const knownArchitecturesLoaded = useSelector(
    selectors.general.knownArchitectures.loaded
  );
  const pocketsToDisableLoaded = useSelector(
    selectors.general.pocketsToDisable.loaded
  );
  const repositoriesLoaded = useSelector(selectors.repositories.loaded);
  const repositoriesSaved = useSelector(selectors.repositories.saved);
  const repositoriesSaving = useSelector(selectors.repositories.saving);
  const allLoaded =
    componentsToDisableLoaded &&
    knownArchitecturesLoaded &&
    pocketsToDisableLoaded &&
    repositoriesLoaded;

  const dispatch = useDispatch();

  // Fetch data if not all loaded.
  useEffect(() => {
    if (!allLoaded) {
      dispatch(actions.general.fetchComponentsToDisable());
      dispatch(actions.general.fetchKnownArchitectures());
      dispatch(actions.general.fetchPocketsToDisable());
      dispatch(actions.repositories.fetch());
    }
  }, [dispatch, allLoaded]);

  // Create a saved notification if successful
  useEffect(() => {
    if (repositoriesSaved) {
      const action = repository ? "updated" : "added";
      dispatch(actions.repositories.cleanup());
      dispatch(
        messages.add(`${savedRepo} ${action} successfully.`, "information")
      );
      setSavedRepo();
    }
  }, [dispatch, repository, repositoriesSaved, savedRepo]);

  // Clean up saved and error states on unmount.
  useEffect(() => {
    dispatch(actions.repositories.cleanup());
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
        <Card highlighted className="repo-form">
          <Row>
            <Col size="2">
              <h4>{title}</h4>
            </Col>
            <Col size="8">
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

                  if (repository) {
                    params.id = repository.id;
                    dispatch(actions.repositories.update(params));
                  } else {
                    dispatch(actions.repositories.create(params));
                  }
                  setSavedRepo(values.name);
                }}
                render={formikProps => (
                  <Form onSubmit={formikProps.handleSubmit}>
                    <RepositoryFormFields
                      formikProps={formikProps}
                      type={type}
                    />
                    <div className="repo-form__buttons">
                      <Button
                        appearance="base"
                        className="u-no-margin--bottom"
                        onClick={() => history.goBack()}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <ActionButton
                        appearance="positive"
                        className="u-no-margin--bottom"
                        disabled={
                          repositoriesSaving || formikFormDisabled(formikProps)
                        }
                        loading={repositoriesSaving}
                        success={repositoriesSaved}
                        type="submit"
                      >
                        {`Save ${typeString}`}
                      </ActionButton>
                    </div>
                  </Form>
                )}
              ></Formik>
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
};

RepositoryForm.propTypes = {
  type: PropTypes.oneOf(["ppa", "repository"]).isRequired,
  repository: RepositoryShape
};

export default RepositoryForm;
