import MachineListPagination, { Label } from "./MachineListPagination";
import type { Props as MachineListPaginationProps } from "./MachineListPagination";

import { fireEvent, render, screen, userEvent } from "testing/utils";

describe("MachineListPagination - display", () => {
  let props: MachineListPaginationProps;
  beforeEach(() => {
    props = {
      currentPage: 1,
      itemsPerPage: 20,
      machineCount: 100,
      machinesLoading: false,
      paginate: jest.fn(),
    };
  });

  it("displays pagination if there are machines", () => {
    render(<MachineListPagination {...props} />);
    expect(
      screen.getByRole("navigation", { name: Label.Pagination })
    ).toBeInTheDocument();
  });

  it("does not display pagination if there are no machines", () => {
    props.machineCount = 0;
    render(<MachineListPagination {...props} />);
    expect(
      screen.queryByRole("navigation", { name: Label.Pagination })
    ).not.toBeInTheDocument();
  });

  it("displays pagination while refetching machines", () => {
    const { rerender } = render(<MachineListPagination {...props} />);
    expect(
      screen.getByRole("navigation", { name: Label.Pagination })
    ).toBeInTheDocument();
    rerender(<MachineListPagination {...props} machinesLoading={true} />);
    expect(
      screen.getByRole("navigation", { name: Label.Pagination })
    ).toBeInTheDocument();
  });

  it("hides pagination if there are no refetched machines", () => {
    const { rerender } = render(<MachineListPagination {...props} />);
    expect(
      screen.getByRole("navigation", { name: Label.Pagination })
    ).toBeInTheDocument();
    props.machinesLoading = true;
    rerender(<MachineListPagination {...props} />);
    expect(
      screen.getByRole("navigation", { name: Label.Pagination })
    ).toBeInTheDocument();
    props.machinesLoading = false;
    props.machineCount = 0;
    rerender(<MachineListPagination {...props} />);
    expect(
      screen.queryByRole("navigation", { name: Label.Pagination })
    ).not.toBeInTheDocument();
  });
});

describe("MachineListPagination - interaction", () => {
  let props: MachineListPaginationProps;
  beforeEach(() => {
    props = {
      currentPage: 1,
      itemsPerPage: 20,
      machineCount: 100,
      machinesLoading: false,
      paginate: jest.fn(),
    };
  });

  it("calls a function to go to the next page when the 'Next page' button is clicked", async () => {
    render(<MachineListPagination {...props} />);
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(props.paginate).toHaveBeenCalledWith(2);
  });

  it("calls a function to go to the previous page when the 'Previous page' button is clicked", async () => {
    props.currentPage = 2;

    render(<MachineListPagination {...props} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Previous page" })
    );
    expect(props.paginate).toHaveBeenCalledWith(1);
  });

  it("takes an input for page number and calls a function to paginate when Enter is pressed", async () => {
    render(<MachineListPagination {...props} />);

    const pageInput = screen.getByRole("spinbutton", { name: "page number" });

    // Using userEvent to clear this first doesn't work, so we have to use fireEvent instead.
    fireEvent.change(pageInput, { target: { value: "4" } });
    await userEvent.click(pageInput);
    await userEvent.keyboard("{Enter}");

    expect(props.paginate).toHaveBeenCalledWith(4);
  });

  it("displays an error if no value is present in the page number input", async () => {
    render(<MachineListPagination {...props} />);

    const pageInput = screen.getByRole("spinbutton", { name: "page number" });

    await userEvent.clear(pageInput);
    expect(screen.getByText(/Enter a page number/i)).toBeInTheDocument();
  });

  it("displays an error if an invalid page number is entered", async () => {
    render(<MachineListPagination {...props} />);

    const pageInput = screen.getByRole("spinbutton", { name: "page number" });

    // Using userEvent to clear this first doesn't work, so we have to use fireEvent instead.
    fireEvent.change(pageInput, { target: { value: "69" } });
    expect(
      screen.getByText(/"69" is not a valid page number/i)
    ).toBeInTheDocument();
  });
});
