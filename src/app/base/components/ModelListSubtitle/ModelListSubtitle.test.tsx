import ModelListSubtitle, { TestIds } from "./ModelListSubtitle";

import { userEvent, render, screen } from "testing/utils";

describe("ModelListSubtitle", () => {
  it("correctly displays when one model is available and none selected", () => {
    render(<ModelListSubtitle available={1} modelName="machine" />);

    expect(screen.getByTestId(TestIds.Subtitle).textContent).toBe(
      "1 machine available"
    );
  });

  it("correctly displays when more than one model is available and none selected", () => {
    render(<ModelListSubtitle available={2} modelName="machine" />);

    expect(screen.getByTestId(TestIds.Subtitle).textContent).toBe(
      "2 machines available"
    );
  });

  it("correctly displays when no models are available", () => {
    render(<ModelListSubtitle available={0} modelName="machine" />);

    expect(screen.getByTestId(TestIds.Subtitle).textContent).toBe(
      "No machines available"
    );
  });

  it("correctly displays when all models are selected", () => {
    render(
      <ModelListSubtitle available={2} modelName="machine" selected={2} />
    );

    expect(screen.getByTestId(TestIds.Subtitle).textContent).toBe(
      "All machines selected"
    );
  });

  it("correctly displays when some models are selected", () => {
    render(
      <ModelListSubtitle available={2} modelName="machine" selected={1} />
    );

    expect(screen.getByTestId(TestIds.Subtitle).textContent).toBe(
      "1 of 2 machines selected"
    );
  });

  it("can render a filter button when some models are selected", async () => {
    const filterSelected = jest.fn();
    render(
      <ModelListSubtitle
        available={2}
        filterSelected={filterSelected}
        modelName="machine"
        selected={1}
      />
    );

    await userEvent.click(screen.getByTestId(TestIds.Filter));

    expect(screen.queryByTestId(TestIds.Subtitle)).not.toBeInTheDocument();
    expect(filterSelected).toHaveBeenCalled();
  });
});
