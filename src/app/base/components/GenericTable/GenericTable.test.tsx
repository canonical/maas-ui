import { useRef } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { vi } from "vitest";

import GenericTable from "./GenericTable";

import type { PaginationBarProps } from "@/app/base/components/GenericTable/PaginationBar/PaginationBar";
import type { Image } from "@/app/images/types";
import type { UtcDatetime } from "@/app/store/types/model";
import * as factory from "@/testing/factories";
import { userEvent, screen, render } from "@/testing/utils";

describe("GenericTable", () => {
  // Set up ResizeObserver mock before each test
  beforeEach(() => {
    // Mock the ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Mock window event listeners
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  const columns: ColumnDef<Image, Partial<Image>>[] = [
    {
      id: "release",
      accessorKey: "release",
      enableSorting: true,
      header: () => "Release title",
    },
    {
      id: "architecture",
      accessorKey: "architecture",
      enableSorting: false,
      header: () => "Architecture",
    },
    {
      id: "size",
      accessorKey: "size",
      enableSorting: false,
      header: () => "Size",
    },
  ];

  const data: Image[] = [
    {
      id: 0,
      release: "16.04 LTS",
      architecture: "amd64",
      name: "Ubuntu",
      size: "1.3 MB",
      lastSynced: "Mon, 06 Jan. 2025 10:45:24",
      canDeployToMemory: true,
      status: "Synced",
      lastDeployed: "Thu, 15 Aug. 2019 06:21:39" as UtcDatetime,
      machines: 2,
      resource: factory.bootResource({
        name: "ubuntu/xenial",
        arch: "amd64",
        title: "16.04 LTS",
      }),
    },
    {
      id: 1,
      release: "18.04 LTS",
      architecture: "arm64",
      name: "Ubuntu",
      size: "1.3 MB",
      lastSynced: "Mon, 06 Jan. 2025 10:45:24",
      canDeployToMemory: true,
      status: "Synced",
      lastDeployed: "Thu, 15 Aug. 2019 06:21:39" as UtcDatetime,
      machines: 2,
      resource: factory.bootResource({
        name: "ubuntu/bionic",
        arch: "amd64",
        title: "18.04 LTS",
      }),
    },
  ];

  const mockFilterCells = vi.fn(() => true);
  const mockFilterHeaders = vi.fn(() => true);

  it("renders table with headers and rows", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    expect(screen.getByText("Release title")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();

    expect(screen.getByText("16.04 LTS")).toBeInTheDocument();
    expect(screen.getByText("18.04 LTS")).toBeInTheDocument();
  });

  it("can change pages", async () => {
    const setPagination = vi.fn();
    const pagination: PaginationBarProps = {
      currentPage: 1,
      dataContext: "",
      handlePageSizeChange: vi.fn(),
      isPending: false,
      itemsPerPage: 10,
      setCurrentPage: setPagination,
      totalItems: 100,
    };
    render(
      <GenericTable
        columns={columns}
        data={[]}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        noData={<span>No data</span>}
        pagination={pagination}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Next page" })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(setPagination).toHaveBeenCalled();
  });

  it('displays "No data" when the data array is empty', () => {
    render(
      <GenericTable
        columns={columns}
        data={[]}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        noData={<span>No data</span>}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("applies sorting when a sortable header is clicked", async () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    await userEvent.click(screen.getByText("Release title"));

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("16.04 LTS");
    expect(rows[2]).toHaveTextContent("18.04 LTS");
  });

  // New tests to cover more features

  it("renders loading state correctly", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={true}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    // Table should have aria-busy attribute when loading
    const table = screen.getByRole("grid");
    expect(table).toHaveAttribute("aria-busy", "true");

    // Should render placeholders
    const placeholders = screen.getAllByText("XXXxxxx.xxxxxxxxx");
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it("supports row selection when canSelect is true", async () => {
    const mockSetRowSelection = vi.fn();
    render(
      <GenericTable
        canSelect={true}
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={mockSetRowSelection}
      />
    );

    // Should render checkboxes
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    // Click on a checkbox should trigger selection change
    await userEvent.click(checkboxes[1]); // Click first row checkbox
    expect(mockSetRowSelection).toHaveBeenCalled();
  });

  it("uses custom class names when provided", () => {
    render(
      <GenericTable
        className="custom-table-class"
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    const tableWrapper =
      screen.getByTestId("p-generic-table") ||
      screen.getByRole("grid").closest(".p-generic-table");
    expect(tableWrapper).toHaveClass("custom-table-class");
  });

  it("supports grouping rows by specified columns", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        groupBy={["release"]}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    // Check if grouped rows are rendered correctly
    const groupRows = screen
      .getAllByRole("row")
      .filter((row) => row.classList.contains("p-generic-table__group-row"));
    expect(groupRows.length).toBeGreaterThan(0);
  });

  it("supports expanded/collapsed state for grouped rows", async () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        groupBy={["release"]}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    // Find expand/collapse buttons and click one
    const expandButtons = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.getAttribute("aria-label")?.includes("expand") ||
          button.getAttribute("aria-label")?.includes("collapse")
      );

    if (expandButtons.length) {
      const initialRows = screen.getAllByRole("row").length;
      await userEvent.click(expandButtons[0]);
      const rowsAfterClick = screen.getAllByRole("row").length;

      // Number of visible rows should change when expanding/collapsing
      expect(rowsAfterClick).not.toEqual(initialRows);
    }
  });

  it("applies initial sortBy configuration", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
        sortBy={[{ id: "release", desc: true }]}
      />
    );

    // With desc: true, 18.04 should appear before 16.04
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    expect(firstDataRow).toHaveTextContent("18.04 LTS");
  });

  it("applies variant styles correctly", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
        variant="regular"
      />
    );

    const table = screen.getByRole("grid");
    expect(table).not.toHaveClass("p-generic-table__is-full-height");

    // Render with full-height variant
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
        variant="full-height"
      />
    );

    const fullHeightTable = screen.getAllByRole("grid")[1];
    expect(fullHeightTable).toHaveClass("p-generic-table__is-full-height");
  });

  it("handles pin groups correctly", () => {
    // Create data with different architectures for testing pinning
    const extendedData = [
      ...data,
      {
        id: 2,
        release: "20.04 LTS",
        architecture: "armhf",
        name: "Ubuntu",
        size: "1.5 MB",
        lastSynced: "Mon, 06 Jan. 2025 10:45:24",
        canDeployToMemory: true,
        status: "Synced",
        lastDeployed: "Thu, 15 Aug. 2019 06:21:39" as UtcDatetime,
        machines: 1,
        resource: factory.bootResource({
          name: "ubuntu/focal",
          arch: "armhf",
          title: "20.04 LTS",
        }),
      },
    ];

    render(
      <GenericTable
        columns={columns}
        data={extendedData}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        groupBy={["architecture"]}
        isLoading={false}
        pinGroup={[{ value: "arm64", isTop: true }]}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    // The arm64 groups should be pinned to the top
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("arm64"); // First group row should be arm64
  });

  it("uses containerRef for calculating table height", () => {
    // Create a component that uses the containerRef
    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement>(null);

      return (
        <div ref={containerRef} style={{ height: "500px" }}>
          <GenericTable
            columns={columns}
            containerRef={containerRef}
            data={data}
            filterCells={mockFilterCells}
            filterHeaders={mockFilterHeaders}
            isLoading={false}
            rowSelection={{}}
            setRowSelection={vi.fn()}
          />
        </div>
      );
    };

    render(<TestComponent />);

    // Verify the table renders correctly with the containerRef
    expect(screen.getByRole("grid")).toBeInTheDocument();

    // Check that ResizeObserver was created
    expect(global.ResizeObserver).toHaveBeenCalled();

    // Check that event listeners were added
    expect(window.addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });

  it("applies filter functions for cells and headers", () => {
    const customFilterCells = vi.fn(
      (_row, column) => column.id !== "size" // Filter out the size column cells
    );

    const customFilterHeaders = vi.fn(
      (header) => header.id !== "size" // Filter out the size column header
    );

    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={customFilterCells}
        filterHeaders={customFilterHeaders}
        isLoading={false}
        rowSelection={{}}
        setRowSelection={vi.fn()}
      />
    );

    // Size header should not be rendered
    expect(screen.queryByText("Size")).not.toBeInTheDocument();

    // Size cell values should not be rendered
    expect(screen.queryByText("1.3 MB")).not.toBeInTheDocument();

    // Other columns should still be visible
    expect(screen.getByText("Release title")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();

    // Verify filter functions were called
    expect(customFilterCells).toHaveBeenCalled();
    expect(customFilterHeaders).toHaveBeenCalled();
  });
});
