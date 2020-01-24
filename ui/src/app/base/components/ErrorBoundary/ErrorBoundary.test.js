import { shallow } from "enzyme";
import React from "react";

import ErrorBoundary from "app/base/components/ErrorBoundary";

describe("ErrorBoundary", () => {
  it("should display an ErrorMessage if wrapped component throws", () => {
    jest.spyOn(console, "error"); // suppress traceback in test

    const Component = () => null;
    const wrapper = shallow(
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    );
    const error = new Error("kerblam");

    wrapper.find(Component).simulateError(error);

    expect(wrapper.state("hasError")).toEqual(true);
  });
});
