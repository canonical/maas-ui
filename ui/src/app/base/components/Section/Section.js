import PropTypes from "prop-types";
import React from "react";

import "./Section.scss";
import Col from "app/base/components/Col";
import NotificationList from "app/base/components/NotificationList";
import Strip from "app/base/components/Strip";

const Section = ({ children, sidebar, title }) => {
  return (
    <div className="section">
      <Strip element="header" className="section__header">
        <h1 className="p-heading--four u-no-margin--bottom">{title}</h1>
      </Strip>
      <Strip
        element="main"
        className="u-no-padding"
        rowClassName="u-equal-height section__content-wrapper"
        includeCol={false}
      >
        {sidebar && (
          <Col element="aside" size="2" className="section__sidebar">
            {sidebar}
          </Col>
        )}
        <Col size={sidebar ? 10 : 12} className="section__content">
          <NotificationList />
          {children}
        </Col>
      </Strip>
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  sidebar: PropTypes.node,
  title: PropTypes.node.isRequired
};

export default Section;
