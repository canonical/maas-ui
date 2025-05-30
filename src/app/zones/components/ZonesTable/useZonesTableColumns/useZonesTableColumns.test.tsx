import { renderHook } from "@testing-library/react";

import useZonesTableColumns from "@/app/zones/components/ZonesTable/useZonesTableColumns/useZonesTableColumns";

vi.mock("@/context", async () => {
  const actual = await vi.importActual("@/context");
  return {
    ...actual!,
  };
});

it("returns the correct number of columns", () => {
  const { result } = renderHook(() => useZonesTableColumns({ isAdmin: false }));
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
