import React from "react";
import PropTypes from "prop-types";

import "./RepositoryForm.scss";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Row from "app/base/components/Row";

export const RepositoryForm = ({ title }) => {
  return (
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
  );
};

RepositoryForm.propTypes = {
  title: PropTypes.string.isRequired
};

export default RepositoryForm;
