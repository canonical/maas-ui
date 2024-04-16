import { render, screen } from "@testing-library/react";

import TestMetrics from "./TestMetrics";

import * as factory from "@/testing/factories";

describe("TestMetrics", () => {
  it("shows a metrics table if the test has metrics", () => {
    const scriptResult = factory.scriptResult({
      results: [factory.scriptResultResult()],
    });
    const closeFunc = vi.fn();
    render(<TestMetrics close={closeFunc} scriptResult={scriptResult} />);
    expect(screen.getByTestId("metrics-table")).toBeInTheDocument();
  });
});
