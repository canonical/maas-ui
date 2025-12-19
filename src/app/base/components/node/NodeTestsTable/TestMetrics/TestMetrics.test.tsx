import { screen } from "@testing-library/react";

import TestMetrics from "./TestMetrics";

import * as factory from "@/testing/factories";
import { renderWithProviders } from "@/testing/utils";

describe("TestMetrics", () => {
  it("shows a metrics table if the test has metrics", () => {
    const scriptResult = factory.scriptResult({
      results: [factory.scriptResultResult()],
    });
    const closeFunc = vi.fn();
    renderWithProviders(
      <TestMetrics close={closeFunc} scriptResult={scriptResult} />
    );
    expect(screen.getByTestId("metrics-table")).toBeInTheDocument();
  });
});
