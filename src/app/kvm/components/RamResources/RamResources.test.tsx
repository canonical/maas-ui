import RamResources from "./RamResources";

import { COLOURS } from "app/base/constants";
import { render, screen } from "testing/utils";

describe("RamResources", () => {
  it("can be made to have a dynamic layout", () => {
    render(<RamResources dynamicLayout generalAllocated={1} generalFree={2} />);

    expect(screen.getByLabelText("ram resources")).toHaveClass(
      "ram-resources--dynamic-layout"
    );
  });

  it("shows hugepages data if provided", () => {
    render(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
      />
    );

    expect(screen.getByTestId("hugepages-data")).toBeInTheDocument();
  });

  it("does not show hugepages data if not provided", () => {
    render(<RamResources generalAllocated={1} generalFree={2} />);

    expect(screen.queryByTestId("hugepages-data")).not.toBeInTheDocument();
  });

  it("show hugepages page size if provided", () => {
    render(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
        pageSize={5}
      />
    );

    expect(screen.getByTestId("page-size")).toBeInTheDocument();
    expect(screen.getByTestId("page-size")).toHaveTextContent("(Size: 5B)");
  });

  it("does not show hugepages page size if not provided", () => {
    render(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
      />
    );

    expect(screen.queryByTestId("page-size")).not.toBeInTheDocument();
  });

  it("can show whether RAM has been over-committed", () => {
    const { container } = render(
      <RamResources
        generalAllocated={1}
        generalFree={-1}
        hugepagesAllocated={3}
        hugepagesFree={-1}
      />
    );

    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(".doughnut-chart__segment")).toHaveStyle(
      `stroke: ${COLOURS.CAUTION}`
    );
  });

  it("shows RAM used by other projects if data provided", () => {
    render(
      <RamResources generalAllocated={1} generalFree={2} generalOther={3} />
    );

    expect(screen.getByTestId("others-col")).toBeInTheDocument();
  });
});
