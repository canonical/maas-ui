import React from "react";
import classNames from "classnames";

import "./Loader.scss";

const Loader = ({ text, isLight, inline }) => (
  <div
    className={classNames("p-loader", "p-text--default", {
      "p-loader--inline": inline
    })}
  >
    <i
      className={`p-icon--spinner u-animation--spin ${
        isLight ? "is-light" : ""
      }`}
    />
    {text && <span className="p-icon__text">{text}</span>}
  </div>
);

export default Loader;
