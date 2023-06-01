import DoughnutChart, { TestIds } from "./DoughnutChart";

import { render, screen } from "testing/utils";

describe("DoughnutChart", () => {
  it("can render with a label", () => {
    render(
      <DoughnutChart
        label="Label!"
        segmentHoverWidth={20}
        segmentWidth={15}
        segments={[
          {
            color: "#06C",
            value: 20,
          },
          {
            color: "#cce0f5",
            value: 5,
          },
        ]}
        size={96}
      />
    );

    expect(screen.getByTestId(TestIds.Label)).toBeInTheDocument();
  });

  it("can render without a label", () => {
    render(
      <DoughnutChart
        segmentHoverWidth={20}
        segmentWidth={15}
        segments={[
          {
            color: "#06C",
            value: 20,
          },
          {
            color: "#cce0f5",
            value: 5,
          },
        ]}
        size={96}
      />
    );

    expect(screen.queryByTestId(TestIds.Label)).not.toBeInTheDocument();
  });
});
