import type { Row } from "@tanstack/react-table";
import type { Mock } from "vitest";
import { describe } from "vitest";

import TableCheckbox from "@/app/images/components/GenericTable/TableCheckbox/TableCheckbox";
import type { Image } from "@/app/images/types";
import * as factory from "@/testing/factories";
import { render, userEvent, screen } from "@/testing/utils";

const getMockRow = (rowProps: Partial<Row<Image>> = {}) => {
  return Object.assign(
    {
      getIsSelected: vi.fn(() => false),
      getIsAllSubRowsSelected: vi.fn(() => false),
      getIsSomeSelected: vi.fn(() => false),
      getCanSelect: vi.fn(() => true),
      getIsGrouped: vi.fn(() => true),
      toggleSelected: vi.fn(),
      subRows: [
        {
          toggleSelected: vi.fn(),
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
          toggleSelected: vi.fn(),
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
            title: "16.04 LTS",
          }),
        },
      ],
    },
    rowProps
  );
};

describe("TableCheckbox.All", () => {
  const renderSelectAllCheckbox = (tableProps?: {
    getSelectedRowModel: Mock<[], { rows: {}[] }>;
    getRowCount: Mock<[], number>;
    getGroupedRowModel: Mock<[], { rows: never[] }>;
  }) => {
    const mockTable = {
      getSelectedRowModel: vi.fn(() => ({ rows: [] })),
      getRowCount: vi.fn(() => 10),
      getGroupedRowModel: vi.fn(() => ({ rows: [] })),
      toggleAllPageRowsSelected: vi.fn(),
      getIsAllPageRowsSelected: vi.fn(() => false),
      ...tableProps,
    };

    // @ts-ignore
    return { ...render(<TableCheckbox.All table={mockTable} />), mockTable };
  };

  it("displays 'unchecked' when no rows are selected", () => {
    renderSelectAllCheckbox();
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("displays 'mixed' state when some rows are selected", () => {
    renderSelectAllCheckbox({
      getSelectedRowModel: vi.fn(() => ({ rows: [{}] })), // 1 row selected
      getRowCount: vi.fn(() => 10),
      getGroupedRowModel: vi.fn(() => ({ rows: [] })),
    });
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed"
    );
  });

  it("displays 'checked' when all rows are selected", () => {
    renderSelectAllCheckbox({
      getSelectedRowModel: vi.fn(() => ({ rows: [{}] })), // Simulate all rows selected
      getRowCount: vi.fn(() => 1),
      getGroupedRowModel: vi.fn(() => ({ rows: [] })),
    });
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("toggles all rows on click", async () => {
    const { mockTable } = renderSelectAllCheckbox();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(mockTable.toggleAllPageRowsSelected).toHaveBeenCalledWith(true);
  });
});

describe("TableCheckbox.Group", () => {
  const renderSelectGroupCheckbox = (rowProps: Partial<Row<Image>> = {}) => {
    const mockRow = getMockRow(rowProps);
    return { ...render(<TableCheckbox.Group row={mockRow} />), ...mockRow };
  };

  it("is enabled when row can be selected", () => {
    renderSelectGroupCheckbox({ getCanSelect: vi.fn(() => true) });
    expect(screen.getByRole("checkbox")).toBeEnabled();
  });

  it("is disabled when row cannot be selected", () => {
    renderSelectGroupCheckbox({ getCanSelect: vi.fn(() => false) });
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("toggles selection state on click", async () => {
    const { subRows, toggleSelected } = renderSelectGroupCheckbox();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(toggleSelected).toHaveBeenCalledWith(true);
    expect(subRows[0].toggleSelected).toHaveBeenCalledWith(true);
    expect(subRows[1].toggleSelected).toHaveBeenCalledWith(true);
  });

  it("sets mixed state correctly", () => {
    renderSelectGroupCheckbox({ getIsSomeSelected: () => true });
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed"
    );
  });

  it("toggles all sub-rows when in mixed state", async () => {
    const { subRows } = renderSelectGroupCheckbox({
      getIsSomeSelected: () => true,
    });

    await userEvent.click(screen.getByRole("checkbox"));
    subRows.forEach((subRow: Row<Image>) =>
      expect(subRow.toggleSelected).toHaveBeenCalledWith(true)
    );
  });
});

describe("TableCheckbox", () => {
  const renderIndividualCheckbox = (rowProps: Partial<Row<Image>> = {}) => {
    const mockRow = {
      getIsSelected: vi.fn(() => false),
      getCanSelect: vi.fn(() => true),
      getToggleSelectedHandler: vi.fn(),
      ...rowProps,
    };
    // @ts-ignore
    return { ...render(<TableCheckbox row={mockRow} />), mockRow };
  };

  it("is enabled when row can be selected", () => {
    renderIndividualCheckbox();
    expect(screen.getByRole("checkbox")).toBeEnabled();
  });

  it("is disabled when row cannot be selected", () => {
    renderIndividualCheckbox({ getCanSelect: vi.fn(() => false) });
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("calls the toggle handler on click", async () => {
    const { mockRow } = renderIndividualCheckbox();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(mockRow.getToggleSelectedHandler).toHaveBeenCalled();
  });
});
