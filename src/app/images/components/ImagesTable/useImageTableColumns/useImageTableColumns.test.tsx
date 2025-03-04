import type { Row } from "@tanstack/react-table";
import { vi } from "vitest";

import useImageTableColumns from "@/app/images/components/ImagesTable/useImageTableColumns/useImageTableColumns";
import type { Image } from "@/app/images/types";
import { renderHook } from "@/testing/utils";

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
    "name",
    "release",
    "architecture",
    "size",
    "canDeployToMemory",
    "status",
    "lastDeployed",
    "machines",
    "action",
  ]);
});
