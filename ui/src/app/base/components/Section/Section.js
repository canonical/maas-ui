import { Col, Strip } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import DeprecationNotices from "app/base/components/DeprecationNotices";
import NotificationList from "app/base/components/NotificationList";

const Section = ({
  children,
  headerClassName,
  showDeprecations = false,
  sidebar,
  title,
}) => {
  return (
    <div className="section">
      <Strip
        className={classNames("section__header", headerClassName)}
        element="header"
        shallow
      >
        {typeof title === "string" ? (
          <h1 className="p-heading--four u-no-margin--bottom">{title}</h1>
        ) : (
          title
        )}
      </Strip>
      <Strip
        element="main"
        includeCol={false}
        rowClassName="u-flex section__content-wrapper"
        shallow
      >
        {sidebar && (
          <Col element="aside" size="2" className="section__sidebar">
            {sidebar}
          </Col>
        )}
        <Col size={sidebar ? 10 : 12} className="section__content">
          {showDeprecations && <DeprecationNotices />}
          <NotificationList />
          {children}
        </Col>
      </Strip>
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  headerClassName: PropTypes.string,
  showDeprecations: PropTypes.bool,
  sidebar: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};

export default Section;
