import PropTypes from "prop-types";
import React from "react";

import "./Section.scss";
import Col from "app/base/components/Col";
import Row from "app/base/components/Row";

const Section = ({ children, sidebar, title }) => {
  return (
    <div className="section">
      <header className="p-strip section__header">
        <Row>
          <h1 className="p-heading--four u-no-margin--bottom">{title}</h1>
        </Row>
      </header>
      <div className="p-strip u-no-padding">
        <Row className="u-equal-height section__content-wrapper">
          {sidebar && (
            <Col element="aside" size="2" className="section__sidebar">
              {sidebar}
            </Col>
          )}
          <Col size={sidebar ? 10 : 12} className="section__content">
            {children}
          </Col>
        </Row>
      </div>
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  sidebar: PropTypes.node,
  title: PropTypes.node.isRequired
};

export default Section;
