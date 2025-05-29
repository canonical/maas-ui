import { renderHook } from "@testing-library/react";

import usePoolsTableColumns from "./usePoolsTableColumns";

vi.mock("@/context", async () => {
  const actual = await vi.importActual("@/context");
  return {
    ...actual!,
  };
});

it("returns the correct number of columns", () => {
  const { result } = renderHook(() => usePoolsTableColumns());
  expect(result.current).toBeInstanceOf(Array);
  expect(result.current.map((column) => column.id)).toStrictEqual([
    "name",
    "machine_ready_count",
    "description",
    "action",
  ]);
});
