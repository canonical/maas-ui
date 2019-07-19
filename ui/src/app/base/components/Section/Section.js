import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./Section.scss";

const Section = ({ children, sidebar, title }) => {
  return (
    <div className="section">
      <header className="p-strip section__header">
        <div className="row">
          <h1 className="p-heading--four u-no-margin--bottom">{title}</h1>
        </div>
      </header>
      <div className="p-strip u-no-padding">
        <div className="row u-equal-height section__content-wrapper">
          {sidebar && (
            <aside className="section__sidebar col-2">{sidebar}</aside>
          )}
          <div
            className={classNames("section__content", {
              "col-10": !!sidebar
            })}
          >
            {children}
          </div>
        </div>
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
