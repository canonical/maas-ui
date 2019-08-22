import { Formik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import "./RepositoryForm.scss";
import actions from "app/settings/actions";
import { formikFormDisabled } from "app/settings/utils";
import { RepositoryShape } from "app/settings/proptypes";
import selectors from "app/settings/selectors";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Form from "app/base/components/Form";
import Loader from "app/base/components/Loader";
import RepositoryFormFields from "../RepositoryFormFields";
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
  const allLoaded =
    componentsToDisableLoaded &&
    knownArchitecturesLoaded &&
    pocketsToDisableLoaded &&
    repositoriesLoaded;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!componentsToDisableLoaded) {
      dispatch(actions.general.fetchComponentsToDisable());
    }
  }, [dispatch, componentsToDisableLoaded]);
  useEffect(() => {
    if (!knownArchitecturesLoaded) {
      dispatch(actions.general.fetchKnownArchitectures());
    }
  }, [dispatch, knownArchitecturesLoaded]);
  useEffect(() => {
    if (!pocketsToDisableLoaded) {
      dispatch(actions.general.fetchPocketsToDisable());
    }
  }, [dispatch, pocketsToDisableLoaded]);
  useEffect(() => {
    if (!repositoriesLoaded) {
      dispatch(actions.repositories.fetch());
    }
  }, [dispatch, repositoriesLoaded]);

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
      name: repository.name,
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
                onSubmit={(values, { resetForm }) => {
                  const payload = {
                    arches: values.arches,
                    components: values.components.split(" ,").filter(Boolean),
                    default: values.default,
                    disable_sources: values.disable_sources,
                    disabled_components: values.disabled_components,
                    disabled_pockets: values.disabled_pockets,
                    distributions: values.distributions
                      .split(" ,")
                      .filter(Boolean),
                    enabled: values.enabled,
                    key: values.key,
                    name: values.name,
                    url: values.url
                  };
                  console.log(payload);
                  resetForm(values);
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
                        onClick={() => window.history.back()}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button
                        appearance="positive"
                        className="u-no-margin--bottom"
                        disabled={formikFormDisabled(formikProps)}
                        type="submit"
                      >
                        {`Save ${typeString}`}
                      </Button>
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
