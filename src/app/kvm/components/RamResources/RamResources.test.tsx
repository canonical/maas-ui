import RamResources from "./RamResources";

import { COLOURS } from "app/base/constants";
import { render } from "testing/utils";

describe("RamResources", () => {
  it("renders", () => {
    const { container } = render(
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

    expect(container).toMatchSnapshot();
  });

  it("can be made to have a dynamic layout", () => {
    const { container } = render(
      <RamResources dynamicLayout generalAllocated={1} generalFree={2} />
    );

    expect(
      container.firstChild.classList.contains("ram-resources--dynamic-layout")
    ).toBe(true);
  });

  it("shows hugepages data if provided", () => {
    const { getByTestId } = render(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
      />
    );

    expect(getByTestId("hugepages-data")).toBeInTheDocument();
  });

  it("does not show hugepages data if not provided", () => {
    const { queryByTestId } = render(
      <RamResources generalAllocated={1} generalFree={2} />
    );

    expect(queryByTestId("hugepages-data")).not.toBeInTheDocument();
  });

  it("show hugepages page size if provided", () => {
    const { getByTestId } = render(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
        pageSize={5}
      />
    );

    expect(getByTestId("page-size")).toBeInTheDocument();
    expect(getByTestId("page-size")).toHaveTextContent("(Size: 5B)");
  });

  it("does not show hugepages page size if not provided", () => {
    const { queryByTestId } = render(
      <RamResources
        generalAllocated={1}
        generalFree={2}
        hugepagesAllocated={3}
        hugepagesFree={4}
      />
    );

    expect(queryByTestId("page-size")).not.toBeInTheDocument();
  });

  it("can show whether RAM has been over-committed", () => {
    const { getByLabelText } = render(
      <RamResources
        generalAllocated={1}
        generalFree={-1}
        hugepagesAllocated={3}
        hugepagesFree={-1}
      />
    );

    expect(getByLabelText("Ram Resources")).toHaveAttribute(
      "data-chart-segments",
      JSON.stringify([{ color: COLOURS.CAUTION, value: 1 }])
    );
  });

  it("shows RAM used by other projects if data provided", () => {
    const { getByTestId } = render(
      <RamResources generalAllocated={1} generalFree={2} generalOther={3} />
    );

    expect(getByTestId("others-col")).toBeInTheDocument();
  });
});
