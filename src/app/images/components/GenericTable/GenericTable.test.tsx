import { vi } from "vitest";

import GenericTable from "./GenericTable";

import type { Image } from "@/app/images/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render } from "@/testing/utils";

describe("GenericTable", () => {
  const columns = [
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
      resource: factory.bootResource({
        name: "ubuntu/bionic",
        arch: "amd64",
        title: "18.04 LTS",
      }),
    },
  ];

  const mockFilterCells = vi.fn(() => true);
  const mockFilterHeaders = vi.fn(() => true);
  const mockGetRowId = vi.fn((row) => row.id.toString());

  it("renders table with headers and rows", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        getRowId={mockGetRowId}
        rowSelection={{}}
        setRowSelection={vi.fn}
      />
    );

    expect(screen.getByText("Release title")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();

    expect(screen.getByText("16.04 LTS")).toBeInTheDocument();
    expect(screen.getByText("18.04 LTS")).toBeInTheDocument();
  });

  it('displays "No data" when the data array is empty', () => {
    render(
      <GenericTable
        columns={columns}
        data={[]}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        getRowId={mockGetRowId}
        rowSelection={{}}
        setRowSelection={vi.fn}
      />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("applies sorting when a sortable header is clicked", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={mockFilterCells}
        filterHeaders={mockFilterHeaders}
        getRowId={mockGetRowId}
        rowSelection={{}}
        setRowSelection={vi.fn}
      />
    );

    userEvent.click(screen.getByText("Release title"));

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("16.04 LTS");
    expect(rows[2]).toHaveTextContent("18.04 LTS");
  });
});
