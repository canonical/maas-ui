import { Card, Col, Row } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import "./FormCard.scss";

export const FormCard = ({ children, stacked, title }) => {
  const titleNode = <h4 className="form-card__title">{title}</h4>;
  const content = stacked ? (
    <>
      {titleNode}
      {children}
    </>
  ) : (
    <Row>
      <Col size="2">{titleNode}</Col>
      <Col size="8">{children}</Col>
    </Row>
  );
  return (
    <Card highlighted={true} className="card-form">
      {content}
    </Card>
  );
};

FormCard.propTypes = {
  children: PropTypes.node,
  stacked: PropTypes.bool,
  title: PropTypes.node.isRequired
};

export default FormCard;
