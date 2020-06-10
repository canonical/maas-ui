import { Col, Strip } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { COL_SIZES } from "app/base/constants";
import NotificationList from "app/base/components/NotificationList";

const Section = ({ children, headerClassName, sidebar, title }) => {
  const { SIDEBAR, TOTAL } = COL_SIZES;
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
        rowClassName="section__content-wrapper"
        shallow
      >
        {sidebar && (
          <Col element="aside" size={SIDEBAR} className="section__sidebar">
            {sidebar}
          </Col>
        )}
        <Col
          size={sidebar ? TOTAL - SIDEBAR : TOTAL}
          className="section__content"
        >
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
  sidebar: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};

export default Section;
