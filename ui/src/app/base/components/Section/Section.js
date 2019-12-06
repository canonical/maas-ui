import { Col, Strip } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import "./Section.scss";
import NotificationList from "app/base/components/NotificationList";

const Section = ({ children, sidebar, title }) => {
  return (
    <div className="section">
      <Strip className="section__header" element="header" shallow>
        <h1 className="p-heading--four u-no-margin--bottom">{title}</h1>
      </Strip>
      <Strip
        element="main"
        includeCol={false}
        rowClassName="u-equal-height section__content-wrapper"
        shallow
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
