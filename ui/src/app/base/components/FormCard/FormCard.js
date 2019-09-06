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
          <h4>{title}</h4>
        </Col>
        <Col size="8">{children}</Col>
      </Row>
    </Card>
  );
};

FormCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired
};

export default FormCard;
