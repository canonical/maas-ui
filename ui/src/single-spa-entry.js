import * as React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";

import packageJson from "../package.json";
import rootComponent from "./index";
import { BASENAME, REACT_BASENAME } from "@maas-ui/maas-ui-shared";

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent,
  errorBoundary(err, info, props) {
    return (
      <div>
        <p>Unable to load MAAS.</p>
        <p>
          Please refresh your browser, and if the issue persists submit an issue
          at: <span>{packageJson.bugs}</span> with the following details:
        </p>
        <p>{err}</p>
        <p>{info}</p>
      </div>
    );
  },
});

export const { bootstrap } = reactLifecycles;
export const mount = (props) => {
  // Get the full path, querystring and hash (location.pathname can't be used as
  // it does not contain the querystring and hash).
  const matches = window.location.href
    // Remove "http://" or "https://".
    .replace(/^.+\/\//, "")
    // Gets the first forward slash and everything after it. This previously
    // used a negative look-behind to ignore the double slash from "http(s)://"
    // and start the selection from the single slash at the start of the pathname,
    // but look-behind does not work in Safari, so beware trying to be smart and
    // improve this regex to remove the .replace() above.
    .match(/\/(?!\/).+/);
  // The app should never reach this entrypoint without the basename and react
  // path set, but to prevent possible future problems this sets the path if
  // there isn't one already.
  let currentURL =
    matches && matches.length ? matches[0] : `/${BASENAME}/${REACT_BASENAME}`;
  // When the app is mounted there needs to be a history change so that
  // react-router updates with the new url. This is re-queried when navigating
  // between the new/legacy clients.
  window.history.replaceState(null, null, currentURL);
  return reactLifecycles.mount(props);
};
export const { unmount } = reactLifecycles;
