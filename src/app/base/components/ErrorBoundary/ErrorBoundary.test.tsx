import * as Sentry from "@sentry/browser";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ErrorBoundary, { Labels } from "./ErrorBoundary";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  versionState as versionStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("ErrorBoundary", () => {
  let state: RootState;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        version: versionStateFactory({ data: "2.7.0" }),
      }),
    });
  });

  it("should display an ErrorMessage if wrapped component throws", () => {
    jest.spyOn(console, "error").mockImplementation(() => null); // suppress traceback in test

    const store = mockStore(state);

    const Component = () => {
      throw new Error("kerblam");
    };
    render(
      <Provider store={store}>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Provider>
    );

    expect(screen.getByText(Labels.ErrorMessage)).toBeInTheDocument();
  });

  it("should not capture exceptions with Sentry when enable_analytics is disabled", () => {
    jest.spyOn(console, "error").mockImplementation(() => null); // suppress traceback in test
    jest.spyOn(Sentry, "captureException").mockImplementation(() => "");

    state.config.items = [
      {
        name: ConfigNames.ENABLE_ANALYTICS,
        value: false,
      },
    ];
    const store = mockStore(state);

    const Component = () => {
      throw new Error("kerblam");
    };
    render(
      <Provider store={store}>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Provider>
    );

    expect(Sentry.captureException).toHaveBeenCalledTimes(0);
  });

  it("should capture exceptions with Sentry when enable_analytics is enabled", () => {
    jest.spyOn(console, "error").mockImplementation(() => null); // suppress traceback in test
    jest.spyOn(Sentry, "captureException").mockImplementation(() => "");

    state.config.items = [
      {
        name: ConfigNames.ENABLE_ANALYTICS,
        value: true,
      },
    ];
    const store = mockStore(state);

    const Component = () => {
      throw new Error("kerblam");
    };
    render(
      <Provider store={store}>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Provider>
    );

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });
});
