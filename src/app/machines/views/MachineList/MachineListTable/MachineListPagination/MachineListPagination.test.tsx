import { render, screen, waitFor } from "@testing-library/react";

import MachineListPagination, { Label } from "./MachineListPagination";

it("displays pagination if there are machines", () => {
  render(
    <MachineListPagination
      currentPage={1}
      itemsPerPage={20}
      machineCount={100}
      machinesLoading={false}
      paginate={jest.fn()}
    />
  );
  expect(
    screen.getByRole("navigation", { name: Label.Pagination })
  ).toBeInTheDocument();
});

it("does not display pagination if there are no machines", () => {
  render(
    <MachineListPagination
      currentPage={1}
      itemsPerPage={20}
      machineCount={0}
      machinesLoading={false}
      paginate={jest.fn()}
    />
  );
  expect(
    screen.queryByRole("navigation", { name: Label.Pagination })
  ).not.toBeInTheDocument();
});

it("displays pagination while refetching machines", () => {
  // Set up shared props to make it clear what's changing on rerenders.
  const props = {
    currentPage: 1,
    itemsPerPage: 20,
    machineCount: 100,
    machinesLoading: false,
    paginate: jest.fn(),
  };
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
  // Set up shared props to make it clear what's changing on rerenders.
  const props = {
    currentPage: 1,
    itemsPerPage: 20,
    machineCount: 100,
    machinesLoading: false,
    paginate: jest.fn(),
  };
  const { rerender } = render(<MachineListPagination {...props} />);
  expect(
    screen.getByRole("navigation", { name: Label.Pagination })
  ).toBeInTheDocument();
  rerender(<MachineListPagination {...props} machinesLoading={true} />);
  expect(
    screen.getByRole("navigation", { name: Label.Pagination })
  ).toBeInTheDocument();
  rerender(
    <MachineListPagination
      {...props}
      machineCount={0}
      machinesLoading={false}
    />
  );
  expect(
    screen.queryByRole("navigation", { name: Label.Pagination })
  ).not.toBeInTheDocument();
});
