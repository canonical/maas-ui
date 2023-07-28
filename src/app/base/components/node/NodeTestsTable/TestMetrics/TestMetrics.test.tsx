import { render, screen } from "@testing-library/react";

import TestMetrics from "./TestMetrics";

import {
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
} from "testing/factories";

describe("TestMetrics", () => {
  it("shows a metrics table if the test has metrics", () => {
    const scriptResult = scriptResultFactory({
      results: [scriptResultResultFactory()],
    });
    const closeFunc = jest.fn();
    render(<TestMetrics close={closeFunc} scriptResult={scriptResult} />);
    expect(screen.getByTestId("metrics-table")).toBeInTheDocument();
  });
});
