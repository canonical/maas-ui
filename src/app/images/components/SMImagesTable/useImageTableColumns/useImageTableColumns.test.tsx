import type { Row } from "@tanstack/react-table";
import { vi } from "vitest";

import useImageTableColumns from "@/app/images/components/SMImagesTable/useImageTableColumns/useImageTableColumns";
import type { Image } from "@/app/images/types";
import { screen, renderHook, render } from "@/testing/utils";

vi.mock("@/context", async () => {
  const actual = await vi.importActual("@/context");
  return {
    ...actual!,
  };
});

const setupTestCase = (name = "test-row") => {
  const commissioningRelease: string | null = "20.04";
  const onDelete: (row: Row<Image>) => void = vi.fn;
  const { result } = renderHook(() =>
    useImageTableColumns({ commissioningRelease, onDelete })
  );
  const props = {
    getValue: () => name,
    row: {
      original: {
        name,
        resource: {
          name,
        },
      },
      getIsSelected: vi.fn(() => false),
      getCanSelect: vi.fn(() => true),
      getToggleSelectedHandler: vi.fn(() => () => {}),
      getIsGrouped: vi.fn(() => false),
    },
  };

  return { result, props };
};

it("returns the correct number of columns", () => {
  const { result } = setupTestCase();
  expect(result.current).toBeInstanceOf(Array);
  expect(result.current.map((column) => column.id)).toStrictEqual([
    "select",
    "name",
    "release",
    "architecture",
    "size",
    "status",
    "canDeployToMemory",
    "action",
  ]);
});

it("input has correct accessible label", () => {
  const { result, props } = setupTestCase("Ubuntu");

  const selectColumn = result.current.find((column) => column.id === "select");
  // @ts-ignore-next-line
  const cellValue = selectColumn.cell(props);
  render(cellValue);

  const inputElement = screen.getByRole("checkbox");
  expect(inputElement).toHaveAccessibleName("Ubuntu");
});
