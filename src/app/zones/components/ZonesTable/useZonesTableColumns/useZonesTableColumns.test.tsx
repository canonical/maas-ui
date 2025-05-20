import { renderHook } from "@testing-library/react";

import useZonesTableColumns from "@/app/zones/components/ZonesTable/useZonesTableColumns/useZonesTableColumns";

vi.mock("@/context", async () => {
  const actual = await vi.importActual("@/context");
  return {
    ...actual!,
  };
});

const setupTestCase = (name = "test-row") => {
  const { result } = renderHook(() => useZonesTableColumns({ isAdmin: false }));
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
    "description",
    "machines_count",
    "devices_count",
    "controllers_count",
    "action",
  ]);
});
