import PropTypes from "prop-types";
import React from "react";

import "./FormCard.scss";
import Col from "app/base/components/Col";
import Card from "app/base/components/Card";
import Row from "app/base/components/Row";

export const FormCard = ({ children, title }) => {
  return (
    <Card highlighted={true} className="card-form">
      <Row>
        <Col size="2">
          <h4 className="card-form__title">{title}</h4>
        </Col>
        <Col size="8">{children}</Col>
      </Row>
    </Card>
  );
};

FormCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node.isRequired
};

export default FormCard;
