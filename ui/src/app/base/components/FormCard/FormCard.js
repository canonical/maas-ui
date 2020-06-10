import { Card, Col, Row } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import { COL_SIZES } from "app/base/constants";

export const FormCard = ({ children, sidebar = true, stacked, title }) => {
  const { CARD_TITLE, SIDEBAR, TOTAL } = COL_SIZES;
  const titleNode = <h4 className="form-card__title">{title}</h4>;
  const content = stacked ? (
    <>
      {titleNode}
      {children}
    </>
  ) : (
    <Row>
      <Col size={CARD_TITLE}>{titleNode}</Col>
      <Col size={sidebar ? TOTAL - SIDEBAR - CARD_TITLE : TOTAL - CARD_TITLE}>
        {children}
      </Col>
    </Row>
  );
  return (
    <Card highlighted={true} className="form-card">
      {content}
    </Card>
  );
};

FormCard.propTypes = {
  children: PropTypes.node,
  stacked: PropTypes.bool,
  title: PropTypes.node.isRequired,
};

export default FormCard;
