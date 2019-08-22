import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import "./RepositoryForm.scss";
import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";

export const RepositoryForm = ({ title }) => {
  const generalLoaded = useSelector(selectors.general.loaded);
  const reposLoaded = useSelector(selectors.repositories.loaded);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!reposLoaded) {
      dispatch(actions.repositories.fetch());
    }
    if (!generalLoaded) {
      dispatch(actions.general.fetchComponentsToDisable());
      dispatch(actions.general.fetchKnownArchitectures());
      dispatch(actions.general.fetchPocketsToDisable());
    }
  }, [dispatch, generalLoaded, reposLoaded]);

  return (
    <>
      {!generalLoaded && !reposLoaded ? (
        <Loader text="Loading..." />
      ) : (
        <Card highlighted className="repo-form">
          <Row>
            <Col size="3">
              <h4>{title}</h4>
            </Col>
            <Col size="7">
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
                  type="button"
                >
                  Save repository
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
};

RepositoryForm.propTypes = {
  title: PropTypes.string.isRequired
};

export default RepositoryForm;
