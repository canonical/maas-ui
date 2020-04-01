import { mount } from "enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/browser";

import ErrorBoundary from "app/base/components/ErrorBoundary";

const mockStore = configureStore();

describe("ErrorBoundary", () => {
  let state;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      general: {
        version: {
          data: "2.7.0",
        },
      },
    };
  });

  it("should display an ErrorMessage if wrapped component throws", () => {
    jest.spyOn(console, "error"); // suppress traceback in test

    const store = mockStore(state);

    const Component = () => null;
    const wrapper = mount(
      <Provider store={store}>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Provider>
    );

    const error = new Error("kerblam");
    wrapper.find(Component).simulateError(error);

    expect(wrapper.find("ErrorBoundary").state("hasError")).toEqual(true);
  });

  it("should not capture exceptions with Sentry when enable_analytics is disabled", () => {
    jest.spyOn(console, "error"); // suppress traceback in test
    jest.spyOn(Sentry, "captureException").mockImplementation(() => {});

    state.config.items = [
      {
        name: "enable_analytics",
        value: false,
      },
    ];
    const store = mockStore(state);

    const Component = () => null;
    const wrapper = mount(
      <Provider store={store}>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Provider>
    );

    const error = new Error("kerblam");
    wrapper.find(Component).simulateError(error);

    expect(Sentry.captureException).toHaveBeenCalledTimes(0);
  });

  it("should capture exceptions with Sentry when enable_analytics is enabled", () => {
    jest.spyOn(console, "error"); // suppress traceback in test
    jest.spyOn(Sentry, "captureException").mockImplementation(() => {});

    state.config.items = [
      {
        name: "enable_analytics",
        value: true,
      },
    ];
    const store = mockStore(state);

    const Component = () => null;
    const wrapper = mount(
      <Provider store={store}>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Provider>
    );

    const error = new Error("kerblam");
    wrapper.find(Component).simulateError(error);

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });
});
