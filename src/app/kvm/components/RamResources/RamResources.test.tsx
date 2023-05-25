import RamResources from "./RamResources";

import { COLOURS } from "app/base/constants";
import { render, screen } from "testing/utils";

describe("RamResources", () => {
  it("renders", () => {
    render(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        generalOther={3}
        hugepagesAllocated={4}
        hugepagesFree={5}
        hugepagesOther={6}
        pageSize={7}
      />
    );

    expect(screen.getByRole("heading", { name: /ram/i })).toBeInTheDocument();
    expect(screen.getByLabelText("ram resources")).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: /ram resources table/i })
    ).toBeInTheDocument();
  });

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
    render(
      <RamResources
        generalAllocated={1}
        generalFree={-1}
        hugepagesAllocated={3}
        hugepagesFree={-1}
      />
    );

    expect(screen.getByTestId("segment")).toHaveStyle(
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
