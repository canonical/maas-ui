import { DEFAULTS } from "../constants";

import PageSizeSelect from "./PageSizeSelect";

import { render, screen, userEvent } from "testing/utils";

const DEFAULT_PAGE_SIZE = DEFAULTS.pageSize;

describe("PageSizeSelect", () => {
  it("renders", () => {
    render(
      <PageSizeSelect pageSize={DEFAULT_PAGE_SIZE} setPageSize={jest.fn()} />
    );
    expect(
      screen.getByRole("combobox", { name: "Items per page" })
    ).toBeInTheDocument();
  });

  it("calls a function to update the page size", async () => {
    const setPageSize = jest.fn();

    render(
      <PageSizeSelect pageSize={DEFAULT_PAGE_SIZE} setPageSize={setPageSize} />
    );

    const pageSizeSelect = screen.getByRole("combobox", {
      name: "Items per page",
    });
    await userEvent.selectOptions(pageSizeSelect, "100");

    expect(setPageSize).toHaveBeenCalledWith(100);
  });
});
