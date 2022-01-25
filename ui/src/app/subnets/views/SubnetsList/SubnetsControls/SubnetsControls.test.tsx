import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubnetsControls from "./SubnetsControls";

it("renders select element correctly", () => {
  render(<SubnetsControls groupBy="fabric" setGroupBy={jest.fn()} />);
  expect(screen.getByRole("combobox", { name: "Group by" })).toBeVisible();
});

it("displays additional information for group by on press", () => {
  render(<SubnetsControls groupBy="fabric" setGroupBy={jest.fn()} />);
  expect(
    screen.queryByTestId("subnets-groupby-help-text")
  ).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "more about group by" }));
  expect(screen.getByTestId("subnets-groupby-help-text")).toBeInTheDocument();
});
