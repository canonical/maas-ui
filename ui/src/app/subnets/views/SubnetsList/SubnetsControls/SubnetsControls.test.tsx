import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubnetsControls from "./SubnetsControls";

import { DEFAULT_DEBOUNCE_INTERVAL } from "app/base/components/DebounceSearchBox/DebounceSearchBox";

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

it("renders select element correctly", () => {
  render(
    <SubnetsControls
      groupBy="fabric"
      setGroupBy={jest.fn()}
      handleSearch={jest.fn()}
    />
  );
  expect(screen.getByRole("combobox", { name: "Group by" })).toBeVisible();
});

it("displays additional information for group by on press", () => {
  render(
    <SubnetsControls
      groupBy="fabric"
      setGroupBy={jest.fn()}
      handleSearch={jest.fn()}
    />
  );
  expect(
    screen.queryByTestId("subnets-groupby-help-text")
  ).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "more about group by" }));
  expect(screen.getByTestId("subnets-groupby-help-text")).toBeInTheDocument();
});

it("calls handleSearch with a correct value on user input", async () => {
  const handleSearch = jest.fn();
  render(
    <SubnetsControls
      groupBy="fabric"
      setGroupBy={jest.fn()}
      handleSearch={handleSearch}
    />
  );
  userEvent.type(screen.getByRole("searchbox", { name: "Search" }), "test");
  act(() => {
    jest.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
  });
  expect(handleSearch).toHaveBeenCalledTimes(1);
  expect(handleSearch).toHaveBeenCalledWith("test");
});
