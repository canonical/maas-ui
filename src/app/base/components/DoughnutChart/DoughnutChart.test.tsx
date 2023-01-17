import DoughnutChart, { TestIds } from "./DoughnutChart";

import { render, screen } from "testing/utils";

describe("DoughnutChart", () => {
  it("renders", () => {
    const { container } = render(
      <DoughnutChart
        label="200GB"
        segmentHoverWidth={20}
        segmentWidth={15}
        segments={[
          {
            color: "#06C",
            tooltip: "Allocated",
            value: 20,
          },
          {
            color: "#cce0f5",
            tooltip: "Free",
            value: 5,
          },
        ]}
        size={96}
      />
    );

    expect(container).toMatchSnapshot();
  });

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
