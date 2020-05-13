import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";

import rootComponent from "./index";

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent,
});
export const { bootstrap } = reactLifecycles;
export const { mount } = reactLifecycles;
export const { unmount } = reactLifecycles;
